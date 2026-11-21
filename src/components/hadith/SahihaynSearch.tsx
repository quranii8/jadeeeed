"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { toArabicNum } from "@/lib/utils";

type Result = { c: string; book: number; bookTitle: string; id: number; num: string; snippet: string };
const NAMES: Record<string, string> = { bukhari: "صحيح البخاري", muslim: "صحيح مسلم" };

/** Searches every hadith of both Sahihs by any words, as the visitor types. */
export function SahihaynSearch({ collection }: { collection?: "bukhari" | "muslim" }) {
  const [q, setQ] = useState("");
  const [data, setData] = useState<{ total: number; results: Result[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setData(null);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/hadith/search?q=${encodeURIComponent(q)}${collection ? `&c=${collection}` : ""}`);
        setData(await r.json());
      } catch {
        setData({ total: -1, results: [] });
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [q, collection]);

  return (
    <div>
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={collection ? `ابحث في ${NAMES[collection]} بأي كلمة` : "ابحث في أحاديث البخاري ومسلم كلها بأي كلمة"}
          className="w-full py-4 pr-14 pl-5 text-base outline-none border-2 rounded"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", boxShadow: "var(--shadow)" }}
          aria-label="بحث في الأحاديث"
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </div>

      {(loading || data) && (
        <div className="mt-3">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            {loading
              ? "جارٍ البحث في الصحيحين…"
              : data!.total < 0
                ? "تعذّر البحث، تحقق من الاتصال."
                : data!.total === 0
                  ? "لا يوجد حديث فيه هذه الكلمات. جرّب كلمة أقصر."
                  : `${toArabicNum(data!.total)} حديثاً${data!.total > data!.results.length ? `، يظهر أول ${toArabicNum(data!.results.length)}` : ""}`}
          </div>
          {!loading && data && data.results.length > 0 && (
            <div className="tile-wall grid gap-[5px] p-[5px] max-h-[70vh] overflow-y-auto" style={{ background: "var(--grout-wall)" }}>
              {data.results.map((r) => (
                <Link key={`${r.c}-${r.id}`} href={`/hadith-nabawi/${r.c}/${r.book}#h-${r.id}`} className="plaster-tile glaze block p-4">
                  <span className="flex items-center justify-between gap-3 text-xs font-bold mb-1.5" style={{ color: "var(--primary)" }}>
                    <span>
                      {NAMES[r.c]}، رقم {toArabicNum(r.num)}
                    </span>
                    <span className="truncate font-semibold" style={{ color: "var(--text-soft)" }}>
                      {r.bookTitle}
                    </span>
                  </span>
                  <span className="block font-naskh text-[15px] leading-loose" style={{ color: "var(--text)" }}>
                    {r.snippet}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
