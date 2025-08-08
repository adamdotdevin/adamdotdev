import { bus } from "./bus";
import { service } from "./cluster";
// import { database } from "./database";
import { realtime } from "./realtime";
import { secret } from "./secret";
import { table } from "./table";

bus.subscribe(
  "TwitchSubscription",
  {
    handler: "packages/functions/src/events/twitch.handler",
    link: [
      // database,
      table,
      realtime,
      secret.ObsPassword,
      secret.ApiKey,
      service,
      ...Object.values(secret.Twitch),
      ...Object.values(secret.Spotify),
    ],
    permissions: [
      { actions: ["iot:*"], resources: ["*"] },
      { actions: ["secretsmanager:*"], resources: ["*"] },
    ],
  },
  {
    pattern: {
      detailType: [{ prefix: { "equals-ignore-case": "twitch." } }],
    },
  },
);

bus.subscribe(
  "ObsSubscription",
  {
    handler: "packages/functions/src/events/obs.handler",
    link: [
      // database,
      table,
      realtime,
      secret.ObsPassword,
      secret.ApiKey,
      service,
      ...Object.values(secret.Twitch),
      ...Object.values(secret.Spotify),
    ],
    permissions: [
      { actions: ["iot:*"], resources: ["*"] },
      { actions: ["secretsmanager:*"], resources: ["*"] },
    ],
  },
  {
    pattern: {
      detailType: [{ prefix: { "equals-ignore-case": "obs." } }],
    },
  },
);

bus.subscribe(
  "SpotifySubscription",
  {
    handler: "packages/functions/src/events/spotify.handler",
    link: [
      // database,
      table,
      realtime,
      secret.ObsPassword,
      secret.ApiKey,
      ...Object.values(secret.Twitch),
      ...Object.values(secret.Spotify),
    ],
    permissions: [
      { actions: ["iot:*"], resources: ["*"] },
      { actions: ["secretsmanager:*"], resources: ["*"] },
    ],
  },
  {
    pattern: {
      detailType: [{ prefix: { "equals-ignore-case": "spotify." } }],
    },
  },
);

table.subscribe(
  {
    handler: "packages/functions/src/events/notification.handler",
    link: [table, realtime, bus, secret.ApiKey],
    permissions: [
      { actions: ["iot:*"], resources: ["*"] },
      { actions: ["secretsmanager:*"], resources: ["*"] },
    ],
  },
  {
    filters: [
      {
        dynamodb: {
          NewImage: {
            __edb_e__: {
              S: ["notification"],
            },
          },
        },
      },
    ],
  },
);
