import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { Resource } from "sst";
import { EntityItem } from "electrodb";
import { AccessToken, Devices, PlaybackState } from "./types";
import { fn } from "../util/fn";
import { z } from "zod";
import { delay } from "../util";
import { event } from "../event";
import { bus } from "sst/aws/bus";
import { SpotifyInfo } from "../schema";
import { spotifyEntity } from "./spotify.ddb";

export module Spotify {
  export const Entity = spotifyEntity;
  export const Events = {
    PlaybackStarted: event("spotify.playback.started", SpotifyInfo),
    PlaybackPaused: event("spotify.playback.paused", SpotifyInfo),
    TrackChanged: event("spotify.track.changed", SpotifyInfo),
  };

  export const AllEvents = Object.values(Events);

  let accessToken: string | null = null;
  let deviceId: string | null | undefined = null;

  const streamingPlaylist = "spotify:playlist:7pyLwPR8k0wAD7DJFDcHZd";

  export const device = async () => {
    if (deviceId) return deviceId;
    const response = await api<Devices>("GET", "/me/player/devices");
    if (typeof response === "string") {
      console.error(response);
      return undefined;
    }
    const devices = response?.devices ?? [];
    console.log({ devices });
    const [device] = devices.filter((d) => d.type === "Computer") || [];

    deviceId = device?.id;
    return device?.id;
  };

  export const get = () =>
    spotifyEntity
      .get({ user: "adamdotdev" })
      .go()
      .then((r) => (r.data ? serialize(r.data) : undefined));

  export const sync = async () => {
    const previous = await get();
    const current = await state().then((state) => ({
      user: "adamdotdev",
      playing: state?.is_playing ?? false,
      shuffle: state?.shuffle_state,
      repeat: state?.repeat_state,
      title: state?.item.name,
      artist:
        state?.item.type === "track"
          ? state?.item.artists.map((a) => a.name).join(", ")
          : state?.item.show.name,
      artwork:
        state?.item.type === "track"
          ? state?.item.album.images[0]?.url
          : (state?.item.images[0]?.url ?? state?.item.show.images[0]?.url),
      progress: state?.progress_ms ?? undefined,
      volume: state?.device.volume_percent ?? undefined,
    }));

    await spotifyEntity.put(current).go();

    if (!previous?.playing && current.playing) {
      await bus.publish(Resource.Bus, Events.PlaybackStarted, current);
    }
    if (previous?.playing && !current.playing) {
      await bus.publish(Resource.Bus, Events.PlaybackPaused, current);
    }
    if (previous?.title !== current.title) {
      await bus.publish(Resource.Bus, Events.TrackChanged, current);
    }

    return current;
  };

  const state = async () => {
    const response = await api<PlaybackState>("GET", "/me/player");
    if (typeof response === "string") {
      console.error(response);
      return undefined;
    }
    return response;
  };

  export const play = async (options?: {
    resume?: boolean;
    fade?: boolean;
    uri?: string;
  }) => {
    try {
      await Promise.all([
        api(
          "PUT",
          "/me/player/play?device_id=" + (await device()),
          options?.resume
            ? undefined
            : {
                body: {
                  context_uri: options?.uri ?? streamingPlaylist,
                  offset: { position: 0 },
                  position_ms: 0,
                },
              },
        ),
        api("PUT", "/me/player/shuffle?state=true"),
        options?.fade ? Promise.resolve() : volume(50),
      ]);
    } catch (e) {
      console.error(e);
      return false;
    }
    if (options?.fade) await fadeIn();
    await sync();
    return true;
  };

  export const pause = async (options?: { fade?: boolean }) => {
    if (options?.fade) await fadeOut();
    await api("PUT", "/me/player/pause");
    await sync();
    return true;
  };

  export const volume = fn(z.number().min(0).max(100), async (value) => {
    await api("PUT", "/me/player/volume?volume_percent=" + value);
    return true;
  });

  export const fadeIn = async () => {
    const current = await state();
    if (!current) return false;

    let currentVolume = current.device.volume_percent ?? 0;
    if (currentVolume !== 0) await volume(0);
    currentVolume = 0;

    while (currentVolume < 50) {
      currentVolume += 5;
      await volume(currentVolume);
      await delay(200);
    }
    return true;
  };

  export const fadeOut = async () => {
    const current = await state();
    if (!current) return false;

    let currentVolume = current.device.volume_percent ?? 0;
    if (currentVolume !== 50) await volume(50);

    while (currentVolume > 0) {
      currentVolume -= 5;
      await volume(currentVolume);
      await delay(200);
    }
    return true;
  };

  async function api<T>(
    method: string,
    path: string,
    options?: { body?: any; accessToken?: string },
  ) {
    let accessToken = options?.accessToken ?? (await getAccessToken());
    const response = await fetch("https://api.spotify.com/v1" + path, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: options?.body ? JSON.stringify(options?.body) : undefined,
    });

    if (response.status === 401) {
      // force refresh token
      const accessToken = await getAccessToken(true);
      return api<T>(method, path, { ...(options ?? {}), accessToken });
    }

    const text = await response.text();
    // console.log({ req: `${method} ${path}`, status: response.status, text });

    if (!response.ok) return text;
    if (response.status === 204 || !text) return;

    try {
      const result = JSON.parse(text) as T;
      return result;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  const getAccessToken = async (force?: boolean) => {
    if (accessToken && !force) return accessToken;

    const client = new SecretsManagerClient();

    if (!force) {
      console.log("Getting access token from secrets manager");
      console.log(Resource.SpotifyAccessToken.arn);

      try {
        const ssmResponse = await client.send(
          new GetSecretValueCommand({
            SecretId: Resource.SpotifyAccessToken.arn,
          }),
        );
        if (ssmResponse.SecretString) {
          const token = JSON.parse(ssmResponse.SecretString!) as AccessToken;
          if (token.access_token) {
            accessToken = token.access_token;
            return accessToken;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Get a new token from Spotify
    console.log("Refreshing access token from Spotify");
    const basic = Buffer.from(
      `${Resource.SpotifyClientId.value}:${Resource.SpotifyClientSecret.value}`,
    ).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: Resource.SpotifyRefreshToken.value,
      }).toString(),
    });

    const token = (await response.json()) as unknown as AccessToken;
    await client.send(
      new PutSecretValueCommand({
        SecretId: Resource.SpotifyAccessToken.arn,
        SecretString: JSON.stringify(token),
      }),
    );
    accessToken = token.access_token;
    return accessToken;
  };

  function serialize(
    input: EntityItem<typeof spotifyEntity>,
  ): z.infer<typeof SpotifyInfo> {
    return {
      playing: input.playing || false,
      shuffle: input.shuffle || false,
      repeat: input.repeat || undefined,
      title: input.title || undefined,
      artist: input.artist || undefined,
      artwork: input.artwork || undefined,
      progress: input.progress || undefined,
      volume: input.volume || undefined,
    };
  }
}
