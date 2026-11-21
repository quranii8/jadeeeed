"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toArabicNum } from "@/lib/utils";

type Row = { n: number; name: string; type: string; ayat: number; words: number; letters: number };
type Key = "n" | "ayat" | "words" | "letters";
const COLS: { k: Key; label: string }[] = [
  { k: "n", label: "الترتيب" },
  { k: "ayat", label: "الآيات" },
  { k: "words", label: "الكلمات" },
  { k: "letters", label: "الحروف" },
];

/** All 114 surahs, sortable by order, ayat, words or letters. */
export function SurahStatsTable({ rows }: { rows: Row[] }) {
  const [k, setK] = useState<Key>("n");
  const [q, setQ] = useState("");
  const sorted = useMemo(() => {
    const r = rows.filter((x) => !q.trim() || x.name.includes(q.trim()));
    return [...r].sort((a, b) => (k === "n" ? a.n - b.n : b[k] - a[k]));
  }, [rows, k, q]);
  const max = Math.max(...rows.map((r) => r[k === "n" ? "ayat" : k]));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>رتّب حسب:</span>
        {COLS.map((c) => (
          <button key={c.k} type="button" onClick={() => setK(c.k)} className="px-3 py-1.5 rounded text-sm font-semibold" style={{ background: k === c.k ? "var(--primary)" : "var(--surface)", color: k === c.k ? "var(--g-on)" : "var(--text)", border: "1px solid var(--border)" }} aria-pressed={k === c.k}>
            {c.label}
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اسم السورة" className="ms-auto px-3 py-1.5 rounded border-2 text-sm w-36" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} aria-label="بحث باسم السورة" />
      </div>
      <div className="p-[5px] overflow-x-auto" style={{ background: "var(--grout-wall)" }}>
        <table className="w-full text-sm plaster-tile" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-soft)" }}>
              <th className="p-2.5 text-right">السورة</th>
              <th className="p-2.5 text-right">النوع</th>
              <th className="p-2.5 text-right">الآيات</th>
              <th className="p-2.5 text-right">الكلمات</th>
              <th className="p-2.5 text-right">الحروف</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.n} style={{ borderTop: "1px solid var(--border-soft)" }}>
                <td className="p-2.5">
                  <Link href={`/surah/${r.n}`} className="font-bold hover:underline">
                    {toArabicNum(r.n)}. {r.name}
                  </Link>
                  <div className="mt-1 h-1.5 rounded" style={{ background: "var(--bg-soft)" }}>
                    <div className="h-1.5 rounded" style={{ width: `${(r[k === "n" ? "ayat" : k] / max) * 100}%`, background: r.type === "makki" ? "var(--gold)" : "var(--emerald)" }} />
                  </div>
                </td>
                <td className="p-2.5">{r.type === "makki" ? "مكية" : "مدنية"}</td>
                <td className="p-2.5 tabular-nums">{toArabicNum(r.ayat)}</td>
                <td className="p-2.5 tabular-nums">{toArabicNum(r.words)}</td>
                <td className="p-2.5 tabular-nums">{toArabicNum(r.letters)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
