"use client";

import React from "react";
import { Carousel } from "@/components/carousel";
import { TomorrowBanner } from "@/components/elements/tomorrow";
import { TerminalBanner } from "@/components/elements/terminal";
import { useOverlaysContext } from "../context";
import { Overlay } from "@/components/overlay";
import { Grid } from "@/components/grid";
import { AudioSpectrum } from "@/components/audio-spectrum";
import { fadeAudioOut } from "@/lib/audio";
import ThemeMusic from "@/components/theme-music";
import { useEvent } from "@/hooks/use-event";
import { OpencodeBanner } from "@/components/elements/opencode";

export default function BreakPage() {
  const context = useOverlaysContext();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEvent("live.fade.audio.out", async () => {
    if (!audioRef.current) return;
    await fadeAudioOut({ audio: audioRef.current });
  });

  React.useEffect(() => {
    setTimeout(async () => {
      await audioRef.current?.play();
    }, 2000);
  }, []);

  return (
    <Overlay>
      <ThemeMusic audioRef={audioRef} />
      <Grid
        centerLeft={
          <div className="mt-10 flex justify-center text-5xl font-light text-mauve-11">
            <div className="absolute z-20 h-4 w-4 rounded-full bg-[#FF8B3E]" />
            <div className="absolute z-10 -mt-1 h-6 w-6 animate-ping rounded-full bg-[#FF8B3E]" />
          </div>
        }
        center={
          <div className="relative mt-[26px] h-full">
            <div className="text-5xl font-light text-mauve-12">
              I&apos;ll be right back
            </div>
            <div className="mt-6 text-4xl font-light text-mauve-11">
              {context.stream?.title ?? "Adam's definitely streaming"}
            </div>
          </div>
        }
        bottomCenter={
          audioRef.current && (
            <Carousel interval={0.5} prioritizeFirst>
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
