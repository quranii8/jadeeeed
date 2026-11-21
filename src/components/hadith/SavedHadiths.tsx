"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useExtras } from "@/lib/extras-store";
import { toArabicNum } from "@/lib/utils";

const NAMES: Record<string, string> = { bukhari: "صحيح البخاري", muslim: "صحيح مسلم" };

export function SavedHadiths() {
  const hadiths = useExtras((s) => s.hadiths);
  const toggle = useExtras((s) => s.toggleHadith);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  if (!hadiths.length)
    return (
      <p className="plaster-tile p-5 text-sm" style={{ color: "var(--text-muted)" }}>
        لم تحفظ أي حديث بعد. اضغط «حفظ» تحت أي حديث في{" "}
        <Link href="/hadith-nabawi" className="font-semibold underline" style={{ color: "var(--primary)" }}>الصحيحين</Link> ليظهر هنا.
      </p>
    );
  return (
    <div className="tile-wall grid gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
      {hadiths.map((h) => (
        <div key={`${h.c}-${h.id}`} className="plaster-tile p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-2 text-xs font-bold" style={{ color: "var(--primary)" }}>
            <span>{NAMES[h.c]}، رقم {toArabicNum(h.num)}</span>
            <button type="button" onClick={() => toggle(h)} className="font-semibold" style={{ color: "var(--terracotta)" }}>
              إزالة
            </button>
          </div>
          <Link href={`/hadith-nabawi/${h.c}/${h.book}#h-${h.id}`} className="block font-quran text-lg leading-loose line-clamp-4 hover:underline">
            {h.matn}
          </Link>
        </div>
      ))}
    </div>
  );
}
