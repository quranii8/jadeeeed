"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { StoryHadith } from "@/lib/prophet-stories";
import { toArabicNum } from "@/lib/utils";

const LONG = 420;

function HadithCard({ h }: { h: StoryHadith }) {
  const [open, setOpen] = useState(false);
  const long = h.text.length > LONG;
  const shown = !long || open ? h.text : h.text.slice(0, h.text.lastIndexOf(" ", LONG)) + "…";
  return (
    <figure className="py-5 border-t first:border-t-0 first:pt-0" style={{ borderColor: "var(--border)" }}>
      {h.context && (
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          {h.context}
        </p>
      )}
      <blockquote className="font-quran text-lg md:text-xl leading-loose">
        قال رسول الله ﷺ: «{shown}»
      </blockquote>
      {long && (
        <button onClick={() => setOpen(!open)} className="text-sm font-semibold mt-2" style={{ color: "var(--primary)" }}>
          {open ? "عرض أقل" : "اقرأ الحديث كاملاً"}
        </button>
      )}
      <figcaption className="mt-3 flex items-center justify-between text-sm">
        <span className="px-3 py-1 rounded font-semibold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
          {h.collection} ({toArabicNum(h.number)})
        </span>
        <a href={h.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          المصدر <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </figcaption>
    </figure>
  );
}

export function HadithList({ items }: { items: StoryHadith[] }) {
  if (!items.length) return null;
  return (
    <section className="card p-5 md:p-7 mb-5">
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--primary)" }}>
        من السنّة الصحيحة
      </h2>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        بنصّها من صحيحي البخاري ومسلم
      </p>
      <div className="space-y-4">
        {items.map((h) => (
          <HadithCard key={h.url + h.text.slice(0, 10)} h={h} />
        ))}
      </div>
    </section>
  );
}
