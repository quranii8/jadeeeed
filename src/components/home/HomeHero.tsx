import Link from "next/link";
import { HeroActions } from "./HeroActions";
import { HeroStage } from "./HeroStage";
import { SearchBar } from "../SearchBar";
import { verseOfTheDay } from "@/lib/daily-verses";
import { toArabicNum } from "@/lib/utils";

/**
 * First viewport: dawn over misty hills. The verse of the day rises out of the
 * mist word by word and is the only large thing on screen; the platform name sits
 * above it as a quiet inscription, search and the two actions below.
 */
export function HomeHero() {
  const v = verseOfTheDay();
  const words = v.ar.split(" ");
  const long = v.ar.length > 120;

  return (
    <section className="cine-hero relative isolate overflow-hidden" aria-labelledby="home-title">
      <HeroStage />
      <div className="cine-scrim" aria-hidden="true" />

      <div className="cine-content relative max-w-5xl mx-auto px-5 flex flex-col items-center text-center">
        <div className="cine-in flex items-center gap-3" style={{ ["--d" as string]: "0ms" } as React.CSSProperties}>
          <span className="cine-rule" aria-hidden="true" />
          <h1 id="home-title" className="font-kufic font-bold text-lg md:text-xl tracking-normal" style={{ color: "var(--g-saffron-light)" }}>
            منصة القرآن الكريم
          </h1>
          <span className="cine-rule" aria-hidden="true" />
        </div>
        <p className="cine-in mt-2 text-xs md:text-sm font-medium" style={{ color: "rgba(244,246,251,.72)", ["--d" as string]: "120ms" } as React.CSSProperties}>
          آية اليوم
        </p>

        <figure className="mt-6 md:mt-8 w-full max-w-4xl">
          <blockquote
            lang="ar"
            className={`cine-verse font-hafs ${
              long ? "text-[1.7rem] sm:text-[2.2rem] md:text-[3rem]" : "text-[2.5rem] sm:text-[3.4rem] md:text-[5rem]"
            }`}
          >
            {words.map((w, i) => (
              <span key={i}>
                <span className="cine-word" style={{ ["--i" as string]: i } as React.CSSProperties}>
                  {w}
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </blockquote>
          <figcaption
            className="cine-in mt-5 flex items-center justify-center gap-3 text-sm font-semibold"
            style={{ ["--d" as string]: `${500 + words.length * 90}ms` } as React.CSSProperties}
          >
            <span className="h-px w-8" style={{ background: "var(--g-saffron)" }} aria-hidden="true" />
            <Link href={`/surah/${v.s}#verse-${v.a}`} className="cine-cite">
              سورة {v.name}، الآية {toArabicNum(v.a)}
            </Link>
            <span className="h-px w-8" style={{ background: "var(--g-saffron)" }} aria-hidden="true" />
          </figcaption>
        </figure>

        <div
          className="cine-in relative w-full mt-10 md:mt-12"
          style={{ ["--d" as string]: `${700 + words.length * 90}ms` } as React.CSSProperties}
        >
          <SearchBar />
          <HeroActions />
        </div>
      </div>
      <div className="tile-strip absolute inset-x-0 bottom-0 z-10" />
    </section>
  );
}
