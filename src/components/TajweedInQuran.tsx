"use client";

import Link from "next/link";
import { useState } from "react";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

type Ex = { s: number; a: number; before: string; mark: string; after: string };

/** Real occurrences of a rule across the Mushaf: the words that carry it are lit in gold. */
export function TajweedInQuran({ title, count, examples }: { title: string; count: number; examples: Ex[] }) {
  const [shown, setShown] = useState(8);
  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
        <h2 className="font-kufic font-bold text-2xl">{title}</h2>
        <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          ورد في المصحف نحو {toArabicNum(count)} مرة
        </span>
      </div>
      <div className="tile-wall grid gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {examples.slice(0, shown).map((e, i) => (
          <Link key={i} href={`/surah/${e.s}#verse-${e.a}`} className="plaster-tile glaze block p-4 md:p-5">
            <span className="block text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>
              سورة {getSurah(e.s)?.a}، الآية {toArabicNum(e.a)}
            </span>
            <span className="block font-hafs text-[1.4rem] md:text-[1.6rem] leading-[2.1]">
              {e.before && <span style={{ color: "var(--text-muted)" }}>… {e.before} </span>}
              <mark className="rounded px-1" style={{ background: "color-mix(in srgb, var(--gold) 28%, transparent)", color: "var(--text)" }}>
                {e.mark}
              </mark>
              {e.after && <span style={{ color: "var(--text-muted)" }}> {e.after} …</span>}
            </span>
          </Link>
        ))}
      </div>
      {shown < examples.length && (
        <button type="button" onClick={() => setShown((n) => n + 12)} className="btn btn-outline mt-4 !py-2 text-sm">
          أمثلة أخرى ({toArabicNum(examples.length - shown)})
        </button>
      )}
      <p className="mt-3 text-xs" style={{ color: "var(--text-soft)" }}>
        الأمثلة والعدد مستخرجة آلياً من نص المصحف برواية حفص، والعدد تقريبي.
      </p>
    </div>
  );
}
