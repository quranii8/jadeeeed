"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

export function ContinueReading() {
  const lastRead = useQuranStore((s) => s.lastRead);
  const history = useQuranStore((s) => s.history);

  if (!lastRead && history.length === 0) return null;

  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-5 pt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-kufic font-bold text-3xl md:text-3xl">تابع القراءة</h2>
      </div>

      <div className="tile-wall grid grid-cols-1 md:grid-cols-3 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {lastRead && (() => {
          const s = getSurah(lastRead.surah);
          if (!s) return null;
          return (
            <Link
              href={`/surah/${s.n}${lastRead.verse ? `#verse-${lastRead.verse}` : ""}`}
              className="wall-tile glaze p-5 flex items-center gap-4"
              style={{ backgroundColor: "var(--g-cobalt)", color: "var(--g-on)" }}
            >
              <div
                className="w-14 h-14 rounded grid place-items-center shrink-0"
                style={{ background: "var(--g-saffron)", color: "var(--g-on-saffron)" }}
              >
                <Play className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">سورة {s.a}</div>
                <div className="text-xs" style={{ color: "var(--g-on-muted)" }}>آخر قراءة،{" "}
                  {lastRead.verse ? `الآية ${toArabicNum(lastRead.verse)}` : "البداية"}
                </div>
              </div>
            </Link>
          );
        })()}

        {history.slice(0, 3).filter(h => !lastRead || h.surah !== lastRead.surah).slice(0, 2).map((h) => {
          const s = getSurah(h.surah);
          if (!s) return null;
          return (
            <Link
              key={h.surah}
              href={`/surah/${s.n}`}
              className="plaster-tile glaze p-5 flex items-center gap-4"
            >
              <div
                className="w-14 h-14 rounded grid place-items-center font-bold text-lg shrink-0"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {toArabicNum(s.n)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">سورة {s.a}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  من السجل، {toArabicNum(s.v)} آية
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
