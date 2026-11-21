"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";
import { toArabicNum } from "@/lib/utils";
import type { DhikrCategory, DhikrGroup } from "@/lib/adhkar";

const GLAZES = ["var(--g-cobalt)", "var(--g-emerald)", "var(--g-terracotta)", "var(--g-ink)", "var(--g-saffron-deep)"];
const strip = (s: string) => s.replace(/[ً-ٰٟ]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

/** Every chapter of Hisn al-Muslim, grouped; search runs over chapter titles and the adhkar themselves. */
export function AdhkarIndex({ groups, chapters }: { groups: DhikrGroup[]; chapters: DhikrCategory[] }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState<string>("all");

  const shown = useMemo(() => {
    const t = strip(q.trim());
    return chapters.filter(
      (c) => (g === "all" || c.group === g) && (!t || strip(c.title).includes(t) || c.items.some((d) => strip(d.text).includes(t)))
    );
  }, [q, g, chapters]);

  return (
    <div>
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن ذكر أو مناسبة: السفر، المطر، الكرب…"
          className="w-full py-4 pr-14 pl-5 text-base outline-none border-2 rounded"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", boxShadow: "var(--shadow)" }}
          aria-label="بحث في الأذكار"
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="أبواب الأذكار">
        {[{ id: "all", title: "الكل", icon: "" } as DhikrGroup, ...groups].map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={g === x.id}
            onClick={() => setG(x.id)}
            className="px-3.5 py-2 rounded text-sm font-semibold"
            style={{ background: g === x.id ? "var(--primary)" : "var(--surface)", color: g === x.id ? "var(--g-on)" : "var(--text)", border: "1px solid var(--border)" }}
          >
            {x.title}
          </button>
        ))}
      </div>

      {groups
        .filter((x) => g === "all" || x.id === g)
        .map((grp, gi) => {
          const list = shown.filter((c) => c.group === grp.id);
          if (!list.length) return null;
          return (
            <section key={grp.id} className="mt-10" aria-labelledby={`g-${grp.id}`}>
              <h2 id={`g-${grp.id}`} className="font-kufic font-bold text-2xl md:text-3xl mb-4 flex items-center gap-2">
                <span style={{ color: "var(--gold)" }}><AppIcon name={grp.icon} /></span>
                {grp.title}
                <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>({toArabicNum(list.length)})</span>
              </h2>
              <div className="tile-wall grid grid-cols-2 md:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
                {list.map((c, i) => {
                  const big = i === 0 && list.length > 3;
                  return (
                    <Link
                      key={c.id}
                      href={`/adhkar/${c.id}`}
                      className={`${big ? "wall-tile col-span-2" : "plaster-tile"} glaze relative overflow-hidden p-4 min-h-[7rem] flex flex-col justify-between`}
                      style={big ? { backgroundColor: GLAZES[gi % GLAZES.length], color: "var(--g-on)" } : undefined}
                    >
                      {big && <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-60" />}
                      <span className={`relative font-bold leading-snug ${big ? "font-kufic text-2xl" : "text-[15px]"}`}>{c.title}</span>
                      <span className="relative text-xs mt-2" style={{ color: big ? "var(--g-on-muted)" : "var(--text-muted)" }}>
                        {toArabicNum(c.items.length)} {c.items.length > 2 ? "أذكار" : "ذكر"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      {shown.length === 0 && <p className="plaster-tile p-6 mt-8 text-center text-sm">لا يوجد ذكر بهذا البحث.</p>}
    </div>
  );
}
