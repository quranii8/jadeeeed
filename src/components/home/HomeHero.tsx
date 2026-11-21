import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
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

      <div className="relative max-w-5xl mx-auto px-5 pt-7 pb-12 md:pt-16 md:pb-24 flex flex-col items-center text-center">
        <h1
          id="home-title"
          className="rise-in font-kufic font-bold text-[2.1rem] leading-[1.25] sm:text-5xl md:text-6xl"
          style={{ color: "var(--on-field)", textShadow: "0 4px 24px rgba(10,22,56,.55)" }}
        >
          منصة القرآن الكريم
        </h1>
        <p className="rise-in mt-2 text-sm md:text-base font-medium" style={{ color: "var(--on-field-muted)", ["--d" as string]: "120ms" } as React.CSSProperties}>
          اقرأ، واستمع، وتدبّر
        </p>

        {/* the medallion: lime plaster set into the heart of the rosette */}
        <figure
          className="rise-in relative mt-6 md:mt-12 w-full max-w-[38rem] px-5 py-6 md:px-12 md:py-11"
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

        <div className="relative w-full mt-6 md:mt-10">
          <SearchBar />
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link href="/surahs" className="btn btn-primary">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              ابدأ القراءة
            </Link>
            <Link
              href="/reciters"
              className="btn"
              style={{ background: "rgba(238,241,236,.1)", borderColor: "rgba(238,241,236,.45)", color: "var(--on-field)" }}
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              استمع للقرّاء
            </Link>
          </div>
        </div>
      </div>
      <div className="tile-strip relative" />
    </section>
  );
}
