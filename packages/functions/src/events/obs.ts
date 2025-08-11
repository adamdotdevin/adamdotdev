import { bus } from "sst/aws/bus";
import { OBS } from "@adamdotdev/core/live/obs";
import { Spotify } from "@adamdotdev/core/spotify/index";
import { Live } from "@adamdotdev/core/live/index";

export const handler = bus.subscriber([...OBS.AllEvents], async (event) => {
  console.log("event", event);

  switch (event.type) {
    case "obs.stream.started":
      await Live.start();
      break;
    case "obs.scene.changed":
      if (
        event.properties.from === "Intro" &&
        event.properties.to === "Camera"
      ) {
        await Spotify.play({ fade: true });
      }
      if (event.properties.to === "Screen") {
        // Disable scene switching while we only use one camera
        // await OBS.startTimer();
      }
      break;

    default:
      break;
  }
});
