"use client";

import React from "react";
import { BrandMark, Ticket } from "@/components/elements";
import { Carousel } from "@/components/carousel";
import { TomorrowBanner } from "@/components/elements/tomorrow";
import { TerminalBanner } from "@/components/elements/terminal";
import { useOverlaysContext } from "../context";
import { Overlay } from "@/components/overlay";
import { TitleScreen } from "./title-screen";
import { Grid } from "@/components/grid";
import { Clock } from "./clock";
import { AudioSpectrum } from "@/components/audio-spectrum";
import { fadeAudioOut } from "@/lib/audio";
import { formatDate } from "@/lib/utils";
import ThemeMusic from "@/components/theme-music";
import { OpencodeBanner } from "@/components/elements/opencode";

const AUDIO_FADE_LENGTH = 5 * 1000;

export default function IntroPage() {
  const context = useOverlaysContext();
  const [showTitleScreen, setShowTitleScreen] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  // const [guest, setGuest] =React.useState<Guest | undefined>(stream.guest)

  const handleClockStart = React.useCallback(() => {
    setTimeout(async () => {
      await audioRef.current?.play();
    }, 2000);
  }, []);

  const handleClockStop = React.useCallback(async () => {
    if (!audioRef.current) return;

    await fadeAudioOut({ audio: audioRef.current, length: AUDIO_FADE_LENGTH });
    setShowTitleScreen(true);
  }, []);

  return (
    <Overlay>
      <ThemeMusic audioRef={audioRef} />
      {showTitleScreen ? (
        <TitleScreen />
      ) : (
        <Grid
          topLeft={<BrandMark />}
          topCenter={
            <div className="flex h-full items-center text-mauve-12">
              Streaming web development most weekdays
            </div>
          }
          centerLeft={
            <div className="mt-[26px] text-right text-5xl font-light text-mauve-11">
              Next
            </div>
          }
          center={
            <div className="mt-[26px]">
              <div className="text-5xl font-light text-mauve-12">
                {context.stream?.title ?? "Adam will stream probably"}
              </div>
              <div className="mt-6 text-4xl font-light text-mauve-11">
                {formatDate(
                  context.stream?.started ?? new Date().toISOString(),
                )}
                <span> CT</span>
              </div>
            </div>
          }
          centerRight={
            <Clock
              minutes={context.dev ? 0.25 : 10}
              onStopTime={AUDIO_FADE_LENGTH}
              className="absolute -top-[118px] right-0 h-[360px] w-[360px]"
              onStart={handleClockStart}
              onStop={handleClockStop}
            />
          }
          bottomCenter={
            audioRef.current && (
              <Carousel interval={0.5} prioritizeFirst>
                <AudioSpectrum audioRef={audioRef} />
                <Ticket />
                <OpencodeBanner />
                <TomorrowBanner />
                <TerminalBanner />
              </Carousel>
            )
          }
        />
      )}
    </Overlay>
  );
}
