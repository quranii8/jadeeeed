"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { HadithCard } from "./HadithCard";
import { toArabicNum } from "@/lib/utils";
import type { Hadith } from "@/lib/sahihayn";

const PAGE = 30;
const NAMES: Record<string, string> = { bukhari: "صحيح البخاري", muslim: "صحيح مسلم" };
/** hadiths gathered from several books (the qudsi list) carry their own collection and book */
const origin = (h: Hadith) => {
  const o = h as unknown as { c?: string; book?: number };
  return o.c ? { c: o.c, book: o.book } : null;
};
const strip = (s: string) =>
  s.replace(/[ؐ-ًؚ-ٰٟ]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

/**
 * Reads one book. The first hadiths arrive with the page; the full book is
 * fetched once, then filtered and revealed in steps as the reader goes down.
 */
export function BookReader({
  src,
  initial,
  total,
  collectionName,
  bookTitle,
  noun = "في هذا الكتاب",
}: {
  src: string;
  initial: Hadith[];
  total: number;
  collectionName: string;
  bookTitle?: string;
  noun?: string;
}) {
  const [all, setAll] = useState<Hadith[]>(initial);
  const [shown, setShown] = useState(PAGE);
  const [q, setQ] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Hadith[]) => {
        if (!alive) return;
        setAll(data);
        // a link to a hadith further down the book opens straight on it
        const id = window.location.hash.replace("#h-", "");
        const idx = data.findIndex((h) => String(h.id) === id);
        if (idx >= 0) {
          setShown(Math.max(PAGE, idx + 5));
          setTimeout(() => document.getElementById(`h-${id}`)?.scrollIntoView({ block: "start" }), 60);
        }
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [src]);

  const list = useMemo(() => {
    const t = strip(q.trim());
    if (!t) return all;
    if (/^[0-9٠-٩]+$/.test(q.trim())) {
      const n = q.trim().replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
      return all.filter((h) => h.num === n);
    }
    return all.filter((h) => strip(h.matn + " " + h.isnad).includes(t));
  }, [all, q]);

  return (
    <div>
      <div className="sticky top-[68px] z-20 py-3 mb-4" style={{ background: "var(--bg)" }}>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE);
            }}
            placeholder="ابحث بكلمة أو برقم الحديث"
            className="w-full py-3.5 pr-12 pl-4 text-base outline-none border-2 rounded"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            aria-label="بحث في الكتاب"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        </div>
        <div className="mt-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          {q.trim()
            ? `${toArabicNum(list.length)} نتيجة`
            : `${toArabicNum(total)} حديثاً ${noun}`}
        </div>
      </div>

      {failed && all.length <= initial.length && (
        <p className="plaster-tile p-5 mb-4 text-sm">
          تعذّر تحميل باقي أحاديث الكتاب. تحقق من الاتصال ثم أعد فتح الصفحة.
        </p>
      )}

      <div className="tile-wall grid gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {list.slice(0, shown).map((h) => (
          <HadithCard
            key={h.id}
            h={h}
            collectionName={origin(h) ? NAMES[origin(h)!.c] : collectionName}
            bookTitle={bookTitle}
            href={origin(h) ? `/hadith-nabawi/${origin(h)!.c}/${origin(h)!.book}#h-${h.id}` : `#h-${h.id}`}
          />
        ))}
        {list.length === 0 && (
          <p className="plaster-tile p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            لا يوجد حديث بهذا النص في هذا الكتاب.
          </p>
        )}
      </div>

      {shown < list.length && (
        <div className="mt-6 text-center">
          <button type="button" className="btn btn-primary" onClick={() => setShown((n) => n + PAGE)}>
            المزيد من الأحاديث ({toArabicNum(list.length - shown)} باقية)
          </button>
        </div>
      )}
    </div>
  );
}
