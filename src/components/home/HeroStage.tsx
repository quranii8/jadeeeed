"use client";

import { useEffect, useRef, useState } from "react";

/** Misty hills at dawn: a calm, people-free loop from the MotionSites backgrounds library. */
const DAWN_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261014_144105_b4b14bc7-788f-4997-86aa-ce920dc8fe96.mp4";

/**
 * The hero's moving layer. A painted dawn (pure CSS + SVG) is always there, so the
 * first paint is never blank and slow connections still get the scene; the video
 * fades in over it only once it is actually playing. Skipped for reduced motion
 * and Save-Data. While the hero scrolls away, the scene slowly sinks and deepens.
 */
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setUseVideo(!reduce && !saveData);

    const section = ref.current?.closest("section");
    if (!section || reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = section.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / h));
      section.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cine-stage" aria-hidden="true">
      <div className="cine-painted">
        <svg className="cine-hills" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5B4E9C" />
              <stop offset="1" stopColor="#2A2F6E" />
            </linearGradient>
            <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2E3A7A" />
              <stop offset="1" stopColor="#16204A" />
            </linearGradient>
            <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1A2756" />
              <stop offset="1" stopColor="#0A1128" />
            </linearGradient>
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C9C3F0" stopOpacity="0" />
              <stop offset=".55" stopColor="#C9C3F0" stopOpacity=".35" />
              <stop offset="1" stopColor="#C9C3F0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#hill-far)" d="M0 330 C180 270 300 300 440 250 S700 170 860 240 1140 300 1440 230 V600 H0Z" />
          <rect className="cine-mist" x="-120" y="250" width="1680" height="140" fill="url(#mist)" />
          <path fill="url(#hill-mid)" d="M0 400 C160 350 330 390 520 340 S860 300 1010 360 1290 400 1440 350 V600 H0Z" />
          <rect className="cine-mist cine-mist--slow" x="-120" y="350" width="1680" height="120" fill="url(#mist)" />
          <path fill="url(#hill-near)" d="M0 480 C220 430 420 470 640 440 S1060 410 1240 450 1380 470 1440 460 V600 H0Z" />
        </svg>
      </div>
      {useVideo && (
        <video
          className="cine-video"
          data-playing={playing ? "" : undefined}
          src={DAWN_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
        />
      )}
    </div>
  );
}
