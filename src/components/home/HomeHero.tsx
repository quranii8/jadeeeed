import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroActions } from "./HeroActions";
import { SearchBar } from "../SearchBar";
import { Vine, Column, StarMark, leafPath } from "@/components/zellige/Rosette";
import { verseOfTheDay } from "@/lib/daily-verses";
import { toArabicNum } from "@/lib/utils";

const FALLING = [
  { left: "8%", t: 21, d: -3, dx: "60px", rot: "280deg", s: 1 },
  { left: "22%", t: 26, d: -14, dx: "-50px", rot: "-240deg", s: 0.8 },
  { left: "71%", t: 23, d: -8, dx: "-70px", rot: "320deg", s: 1.1 },
  { left: "88%", t: 29, d: -19, dx: "40px", rot: "-300deg", s: 0.75 },
];
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${10 + ((i * 53) % 80)}%`,
  t: 7 + (i % 5) * 1.7,
  d: -(i * 1.3),
  s: 2 + (i % 3),
}));

/**
 * First viewport: the Rawdah. A white marble arch stands on the green garden carpet
 * between two gilded columns; gold vines climb its sides as the page opens, and the
 * verse of the day sits inside it with search at its foot as the primary action.
 */
export function HomeHero() {
  const v = verseOfTheDay();
  const long = v.ar.length > 120;

  return (
    <section className="glaze-field relative overflow-hidden" aria-labelledby="home-title">
      <div className="zellige-lattice absolute inset-0 pointer-events-none" />

      {/* the garden air: drifting light and a few falling leaves */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote absolute rounded-full"
            style={{ left: m.left, top: m.top, width: m.s, height: m.s, background: "var(--g-saffron-light)", ["--t" as string]: `${m.t}s`, ["--d" as string]: `${m.d}s` } as CSSProperties}
          />
        ))}
        {FALLING.map((f, i) => (
          <svg
            key={i}
            viewBox="-12 -32 24 34"
            className="leaf-fall absolute top-0"
            style={{ left: f.left, width: 18 * f.s, height: 26 * f.s, ["--t" as string]: `${f.t}s`, ["--d" as string]: `${f.d}s`, ["--dx" as string]: f.dx, ["--rot" as string]: f.rot } as CSSProperties}
          >
            <path d={leafPath(30, 0.42)} fill="var(--g-saffron-light)" opacity=".85" />
          </svg>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-3 sm:px-5 pt-8 md:pt-12 pb-0 flex justify-center">
        <div className="relative w-full max-w-[44rem]">
          <Column className="hidden md:block absolute -right-16 lg:-right-20 bottom-0 h-[96%] w-10 lg:w-12" />
          <Column className="hidden md:block absolute -left-16 lg:-left-20 bottom-0 h-[96%] w-10 lg:w-12" />

          {/* vines climb both sides of the arch */}
          <Vine className="absolute -right-5 sm:-right-7 bottom-0 h-[94%] w-10 sm:w-14 z-10 pointer-events-none" delay={150} />
          <Vine className="absolute -left-5 sm:-left-7 bottom-0 h-[94%] w-10 sm:w-14 z-10 pointer-events-none" flip delay={350} />

          {/* the marble arch */}
          <div
            className="relative px-5 sm:px-10 md:px-14 pt-16 md:pt-20 pb-8 md:pb-10 text-center"
            style={{
              background: "var(--g-plaster)",
              color: "#10241C",
              borderRadius: "999px 999px 0 0 / 230px 230px 0 0",
              boxShadow: "0 -30px 80px -40px rgba(0,0,0,.45), inset 0 0 0 1px rgba(184,137,58,.35)",
            }}
          >
            <div className="zellige-lattice-ink absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit" }} />
            <div className="absolute inset-[10px] pointer-events-none" style={{ border: "1px solid rgba(184,137,58,.55)", borderBottom: 0, borderRadius: "999px 999px 0 0 / 222px 222px 0 0" }} />

            <div className="relative flex justify-center rise-in"><StarMark size={46} /></div>
            <h1 id="home-title" className="relative rise-in font-kufic font-bold text-[2rem] leading-[1.35] sm:text-5xl md:text-[3.4rem] mt-3" style={{ color: "var(--g-cobalt)", ["--d" as string]: "120ms" } as CSSProperties}>
              منصة القرآن الكريم
            </h1>
            <p className="relative rise-in mt-1 text-sm md:text-base" style={{ color: "#5F6E72", ["--d" as string]: "200ms" } as CSSProperties}>
              اقرأ، واستمع، وتدبّر
            </p>

            <div className="relative mx-auto my-6 md:my-7 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-16 md:w-24" style={{ background: "linear-gradient(to left, rgba(184,137,58,.8), rgba(184,137,58,0))" }} />
              <svg width="26" height="14" viewBox="-13 -7 26 14"><path d={leafPath(12, 0.5)} transform="translate(0 5) rotate(-60)" fill="var(--g-saffron)" /><path d={leafPath(12, 0.5)} transform="translate(0 5) rotate(60)" fill="var(--g-saffron)" /></svg>
              <span className="h-px w-16 md:w-24" style={{ background: "linear-gradient(to right, rgba(184,137,58,.8), rgba(184,137,58,0))" }} />
            </div>

            <figure className="relative rise-in" style={{ ["--d" as string]: "300ms" } as CSSProperties}>
              <blockquote className={`font-hafs ${long ? "text-[1.35rem] md:text-[2rem]" : "text-[1.65rem] md:text-[2.55rem]"} leading-[2.05]`} lang="ar" style={{ color: "#0B2A20" }}>
                {v.ar}
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold">
                <Link href={`/surah/${v.s}#verse-${v.a}`} className="hover:underline" style={{ color: "var(--g-cobalt)" }}>
                  سورة {v.name}، الآية {toArabicNum(v.a)}
                </Link>
              </figcaption>
            </figure>

            <div className="relative mt-7 md:mt-8 rise-in" style={{ ["--d" as string]: "420ms" } as CSSProperties}>
              <SearchBar />
              <HeroActions />
            </div>
          </div>
        </div>
      </div>
      <div className="tile-strip relative" />
    </section>
  );
}
