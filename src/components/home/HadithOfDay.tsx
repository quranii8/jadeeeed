import Link from "next/link";
import pool from "@/lib/daily-hadith.json";
import { TileStar } from "@/components/zellige/Rosette";
import { toArabicNum } from "@/lib/utils";

type Daily = { c: string; book: number; id: number; num: string; matn: string };
const NAMES: Record<string, string> = { bukhari: "صحيح البخاري", muslim: "صحيح مسلم" };

/** A short, self-contained saying from the Sahihayn that turns over each day. */
export function HadithOfDay() {
  const list = pool as Daily[];
  const h = list[(Math.floor(Date.now() / 86400000) * 7) % list.length];
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-5 pt-14 md:pt-20" aria-labelledby="hadith-day">
      <h2 id="hadith-day" className="font-kufic font-bold text-3xl md:text-4xl mb-5">حديث اليوم</h2>
      <div className="p-[5px]" style={{ background: "var(--grout-wall)" }}>
        <figure className="plaster-tile relative overflow-hidden p-6 md:p-12 text-center">
          <TileStar color="var(--border)" size={260} className="absolute -top-20 -right-20 pointer-events-none" />
          <TileStar color="var(--border)" size={200} className="absolute -bottom-16 -left-16 pointer-events-none" />
          <blockquote className="relative font-quran text-[1.6rem] md:text-[2.2rem] leading-[2] max-w-3xl mx-auto">{h.matn}</blockquote>
          <figcaption className="relative mt-5 flex items-center justify-center gap-3 text-sm font-semibold" style={{ color: "var(--primary)" }}>
            <span className="h-px w-8" style={{ background: "var(--gold)" }} />
            <Link href={`/hadith-nabawi/${h.c}/${h.book}#h-${h.id}`} className="hover:underline">
              {NAMES[h.c]}، رقم {toArabicNum(h.num)}
            </Link>
            <span className="h-px w-8" style={{ background: "var(--gold)" }} />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
