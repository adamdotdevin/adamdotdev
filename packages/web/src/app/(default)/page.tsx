import React from "react";
import Image from "next/image";
import AdamAvatar from "../../../public/media/adam.jpg";
import { BrandMark } from "@/components/elements";
import Notifications from "@/components/notifications";
import ThemeMusicPlayer from "@/components/theme-music-player";
import StatMuseBackground from "@/components/statmuse-background";
import ProAWSBackground from "@/components/proaws-background";
import TomorrowBackground from "@/components/tomorrow-background";
import TerminalBackground from "@/components/terminal-background";
import OfficeBackground from "@/components/office-background";
import Swipeable from "@/components/swipeable";
import LiveBanner from "@/components/live-banner";
import { shuffle, songs } from "@/lib/utils";
import { getLivestream } from "./actions";

export default async function LandingPage() {
  const playlist = shuffle(songs.map((s) => s.replace(".wav", ".mp3")));
  const livestream = await getLivestream();
  const live = typeof livestream === "string" ? false : livestream.live;

  return (
    <main className="relative h-screen overflow-y-hidden">
      <Swipeable className="h-screen">
        <OfficeBackground />
        <StatMuseBackground />
        <ProAWSBackground />
        <TomorrowBackground />
        <TerminalBackground />
      </Swipeable>
      <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center gap-10 px-5 text-center text-mauve-12">
        <Image src={AdamAvatar} alt="Adam's face" className="w-32 rounded-lg" />
        <div className="flex h-8 items-center justify-center gap-5">
          <BrandMark className="w-32" />
          <h1 className="mt-1 font-bebas text-4xl">adamdotdev</h1>
          <BrandMark className="invisible w-32" />
        </div>
        <p className="pointer-events-auto max-w-lg text-pretty text-lg">
          Adam is an AWS Hero and co-founder of{" "}
          <a
            href="https://www.statmuse.com"
            target="_blank"
            className="text-statmuse"
          >
            statmuse.com
          </a>
          . He teaches AWS at{" "}
          <a className="text-proaws" href="https://proaws.dev" target="_blank">
            proaws.dev
          </a>
          , talks to Dax on{" "}
          <a
            className="text-tomorrow"
            href="https://tomorrow.fm"
            target="_blank"
          >
            tomorrow.fm
          </a>{" "}
          and sells coffee from{" "}
          <a
            className="text-terminal"
            href="https://terminal.shop"
            target="_blank"
          >
            terminal.shop
          </a>
          .
        </p>
        <div className="pointer-events-auto flex max-w-lg items-center gap-6 text-mauve-11 [&>*]:p-1">
          <a
            href="https://x.com/adamdotdev"
            target="_blank"
            className="hover:text-mauve-12"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 fill-current"
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
          <a
            href="https://twitch.tv/adamdotdev"
            target="_blank"
            className="hover:text-mauve-12"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 fill-current"
            >
              <title>Twitch</title>
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
          </a>
          <a
            href="https://youtube.com/@adamdotdev"
            target="_blank"
            className="hover:text-mauve-12"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 fill-current"
            >
              <title>YouTube</title>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://github.com/adamdotdevin"
            target="_blank"
            className="hover:text-mauve-12"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 fill-current"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a
            href="/linkedin"
            target="_blank"
            className="lol hidden hover:text-mauve-12"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 fill-current"
            >
              <title>LinkedIn</title>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="pointer-events-none fixed inset-x-10 top-10 z-50 mt-4 flex items-center justify-center sm:inset-x-auto sm:right-10">
        <Notifications />
      </div>
      <div className="fixed inset-x-0 bottom-0 h-20 bg-mauve-1">
        <Swipeable className="relative h-full">
          <ThemeMusicPlayer playlist={playlist} />
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-center text-sm leading-snug text-mauve-10">
            <span>Adam's theme music created by</span>
            <a
              href="https://www.breakmastercylinder.com/"
              target="_blank"
              className="text-mauve-12"
            >
              The Mysterious Breakmaster Cylinder
            </a>
          </div>
        </Swipeable>
      </div>
      <LiveBanner live={live} />
    </main>
  );
}
