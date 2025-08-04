"use client";

import React from "react";
import { BrandMark } from "@/components/elements";
import { Carousel } from "@/components/carousel";
import { TomorrowBanner } from "@/components/elements/tomorrow";
import { TerminalBanner } from "@/components/elements/terminal";
import { useOverlaysContext } from "../context";
import { Overlay } from "@/components/overlay";
import { Grid } from "@/components/grid";
import { AudioSpectrum } from "@/components/audio-spectrum";
import ThemeMusic from "@/components/theme-music";
import { useEvent } from "@/hooks/use-event";
import { fadeAudioOut } from "@/lib/audio";
import { formatDate } from "@/lib/utils";
import { OpencodeBanner } from "@/components/elements/opencode";

export default function OutroPage() {
  const context = useOverlaysContext();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  // const [guest, setGuest] =React.useState<Guest | undefined>(stream.guest)

  React.useEffect(() => {
    const timeoutHandle = setTimeout(async () => {
      await audioRef.current?.play();
    }, 2000);
    return () => clearTimeout(timeoutHandle);
  }, []);

  useEvent("live.fade.audio.out", async () => {
    if (!audioRef.current) return;
    await fadeAudioOut({ audio: audioRef.current });
  });

  return (
    <Overlay>
      <ThemeMusic audioRef={audioRef} />
      <Grid
        topLeft={<BrandMark />}
        topCenter={
          <div className="flex h-full items-center text-mauve-12">
            Streaming again soon, check the schedule for full details
          </div>
        }
        centerLeft={
          <div className="mt-[26px] text-right text-5xl font-light text-mauve-11">
            Soon
          </div>
        }
        center={
          <div className="mt-[26px]">
            <div className="text-5xl font-light text-mauve-12">
              {context.schedule?.title ?? "Adam will probably stream again"}
            </div>
            <div className="mt-6 text-4xl font-light text-mauve-11">
              {formatDate(
                context.schedule?.scheduled ?? new Date().toISOString(),
              )}{" "}
              <span> CT</span>
            </div>
          </div>
        }
        bottomCenter={
          audioRef.current && (
            <Carousel interval={1 / 4}>
              <AudioSpectrum audioRef={audioRef} />
              <OpencodeBanner />
              <TomorrowBanner />
              <TerminalBanner />
            </Carousel>
          )
        }
      />
    </Overlay>
  );
}
