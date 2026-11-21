"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SURAHS } from "@/lib/surahs";
import { useQuranStore } from "@/lib/store";
import { toArabicNum } from "@/lib/utils";
import { Search } from "lucide-react";
import { TileStar } from "@/components/zellige/Rosette";
import { AppIcon } from "@/components/AppIcon";

type Filter = "all" | "makki" | "madani" | "bookmarked";

export function SurahsBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const bookmarks = useQuranStore((s) => s.bookmarks);

  const bookmarkedSurahs = useMemo(
    () => new Set(bookmarks.map((b) => b.surah)),
    [bookmarks]
  );

  const list = useMemo(() => {
    let arr = SURAHS;
    if (filter === "makki") arr = arr.filter((s) => s.t === "makki");
    else if (filter === "madani") arr = arr.filter((s) => s.t === "madani");
    else if (filter === "bookmarked") arr = arr.filter((s) => bookmarkedSurahs.has(s.n));

    if (q.trim()) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (s) => s.a.includes(q) || s.e.toLowerCase().includes(ql) || String(s.n) === q
      );
    }
    return arr;
  }, [filter, q, bookmarkedSurahs]);

  return (
    <>
      {/* فلاتر + بحث */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex flex-wrap gap-2 flex-1">
          {([
            ["all", "الكل"],
            ["makki", "المكية"],
            ["madani", "المدنية"],
            ["bookmarked", "المحفوظة"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as Filter)}
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{
                background: filter === key ? "var(--primary)" : "var(--surface)",
                color: filter === key ? "white" : "var(--text-muted)",
                border: `1px solid ${filter === key ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث في السور..."
            className="w-full py-2 pr-10 pl-4 rounded text-sm outline-none border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* عدد النتائج */}
      <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(list.length)} سورة
      </div>

      {/* الشبكة */}
      {list.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3"><AppIcon name="inbox" /></div>
          <p style={{ color: "var(--text-muted)" }}>لا توجد سور مطابقة</p>
        </div>
      ) : (
        <div className="tile-wall grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
          {list.map((s) => (
            <Link
              key={s.n}
              href={`/surah/${s.n}`}
              className="plaster-tile glaze p-4 flex items-center gap-4 group"
              style={{ borderColor: bookmarkedSurahs.has(s.n) ? "var(--gold)" : undefined }}
            >
              {/* رقم السورة في نجمة */}
              <div className="relative w-12 h-12 grid place-items-center shrink-0 transition-transform duration-700 group-hover:rotate-45">
                <TileStar color="var(--primary)" size={48} className="absolute inset-0" />
                <span className="relative font-extrabold text-sm group-hover:-rotate-45 transition-transform duration-700" style={{ color: "var(--primary)" }}>
                  {toArabicNum(s.n)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-quran text-xl font-bold">{s.a}</span>
                  {bookmarkedSurahs.has(s.n) && <span style={{ color: "var(--gold)" }}><AppIcon name="star" /></span>}
                </div>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <span>{s.e}</span>
                  <span>•</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      background: s.t === "makki" ? "var(--g-saffron)" : "var(--g-emerald)",
                      color: s.t === "makki" ? "var(--g-on-saffron)" : "var(--g-on)",
                    }}
                  >
                    {s.t === "makki" ? "مكية" : "مدنية"}
                  </span>
                  <span>{toArabicNum(s.v)} آية</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
