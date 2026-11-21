import Link from "next/link";
import { HeroActions } from "./HeroActions";
import { SearchBar } from "../SearchBar";
import { Rosette } from "@/components/zellige/Rosette";
import { verseOfTheDay } from "@/lib/daily-verses";
import { toArabicNum } from "@/lib/utils";

/**
 * First viewport: a cobalt zellige field. The rosette is set tile by tile behind
 * the verse of the day; search sits directly under it as the primary action.
 */
export function HomeHero() {
  const v = verseOfTheDay();
  const long = v.ar.length > 120;

  return (
    <section className="glaze-field relative overflow-hidden" aria-labelledby="home-title">
      <div className="zellige-lattice absolute inset-0 pointer-events-none" />

      {/* the rosette: bleeds past the edges on phones, sits beside the verse on wide screens */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[170vw] max-w-[1100px] sm:w-[120vw] opacity-95">
        <Rosette className="w-full h-auto" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 pt-7 pb-12 md:pt-8 md:pb-10 flex flex-col items-center text-center">
        {/* inscription band: the title sits on solid glaze, never on loose tiles */}
        <div
          className="rise-in relative w-full max-w-[34rem] px-6 pt-3 pb-4 md:pt-4 md:pb-5"
          style={{ background: "#10275F", boxShadow: "0 18px 40px -18px rgba(6,14,40,.8)" }}
        >
          <div className="tile-strip absolute inset-x-0 top-0" style={{ height: 8, backgroundSize: "32px 8px" }} />
          <h1
            id="home-title"
            className="font-kufic font-bold text-[2.1rem] leading-[1.3] sm:text-5xl md:text-6xl mt-2"
            style={{ color: "var(--on-field)" }}
          >
            منصة القرآن الكريم
          </h1>
          <p className="mt-1 text-sm md:text-base font-medium" style={{ color: "var(--on-field-muted)" }}>
            اقرأ، واستمع، وتدبّر
          </p>
          <div className="tile-strip absolute inset-x-0 bottom-0" style={{ height: 8, backgroundSize: "32px 8px" }} />
        </div>

        {/* the medallion: lime plaster set into the heart of the rosette */}
        <figure
          className="rise-in relative mt-6 md:mt-6 w-full max-w-[38rem] px-5 py-6 md:px-12 md:py-8"
          style={{
            background: "#EEF1EC",
            color: "#0E1630",
            clipPath: "polygon(9% 0, 91% 0, 100% 9%, 100% 91%, 91% 100%, 9% 100%, 0 91%, 0 9%)",
            boxShadow: "0 30px 60px -20px rgba(6,14,40,.7)",
            ["--d" as string]: "250ms",
          } as React.CSSProperties}
        >
          <div className="zellige-lattice-ink absolute inset-0 pointer-events-none" />
          <blockquote
            className={`relative font-hafs ${long ? "text-[1.3rem] md:text-[2rem]" : "text-[1.6rem] md:text-[2.5rem]"} leading-[2.05]`}
            lang="ar"
          >
            {v.ar}
          </blockquote>
          <figcaption className="relative mt-4 flex items-center justify-center gap-3 text-sm font-semibold" style={{ color: "#1B3A8C" }}>
            <span className="h-px w-8" style={{ background: "#D99A1E" }} />
            <Link href={`/surah/${v.s}#verse-${v.a}`} className="hover:underline">
              سورة {v.name}، الآية {toArabicNum(v.a)}
            </Link>
            <span className="h-px w-8" style={{ background: "#D99A1E" }} />
          </figcaption>
        </figure>

        <div className="relative w-full mt-6 md:mt-6">
          <SearchBar />
          <HeroActions />
        </div>
      </div>
      <div className="tile-strip relative" />
    </section>
  );
}
