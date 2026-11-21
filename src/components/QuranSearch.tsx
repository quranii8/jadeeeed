"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

type R = { s: number; a: number; t: string };

/** Search every ayah by any words; spelling of hamza, ta marbuta and alif maqsura is forgiven. */
export function QuranSearch() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<{ total: number; results: R[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) return setData(null);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        setData(await (await fetch(`/api/quran/search?q=${encodeURIComponent(q)}`)).json());
      } catch {
        setData({ total: -1, results: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [q]);

  return (
    <div>
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="اكتب كلمة أو أكثر من أي آية"
          className="w-full py-4 pr-14 pl-5 text-lg outline-none border-2 rounded"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", boxShadow: "var(--shadow)" }}
          aria-label="بحث في القرآن"
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </div>
      <div className="mt-3 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
        {loading
          ? "جارٍ البحث…"
          : !data
            ? "مثال: الصبر، رحمة ربك، يا أيها الذين آمنوا"
            : data.total < 0
              ? "تعذّر البحث، تحقق من الاتصال."
              : data.total === 0
                ? "لا توجد آية فيها هذه الكلمات."
                : `${toArabicNum(data.total)} آية${data.total > data.results.length ? `، يظهر أول ${toArabicNum(data.results.length)}` : ""}`}
      </div>
      {data && data.results.length > 0 && (
        <div className="mt-4 tile-wall grid gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
          {data.results.map((r) => (
            <Link key={`${r.s}-${r.a}`} href={`/surah/${r.s}#verse-${r.a}`} className="plaster-tile glaze block p-4 md:p-5">
              <span className="block text-xs font-bold mb-1.5" style={{ color: "var(--primary)" }}>
                سورة {getSurah(r.s)?.a}، الآية {toArabicNum(r.a)}
              </span>
              <span className="block font-quran text-xl leading-loose">{r.t}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
