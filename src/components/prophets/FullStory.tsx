"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ScrollText } from "lucide-react";
import type { StoryParagraph, StorySource } from "@/lib/prophet-stories";
import { toArabicNum } from "@/lib/utils";

const arabicDigits = (s: string) => s.replace(/\d+/g, (d) => toArabicNum(d));

function SourceChip({ src, open, onClick }: { src: StorySource; open: boolean; onClick: () => void }) {
  const Icon = src.kind === "quran" ? BookOpen : ScrollText;
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors"
      style={
        open
          ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
          : { background: "var(--primary-soft)", color: "var(--primary)", borderColor: "transparent" }
      }
    >
      <Icon className="w-3 h-3" />
      {arabicDigits(src.label)}
    </button>
  );
}

/** القصة كاملة: فقرات قصيرة، وتحت كل فقرة مصادرها؛ الضغط على المصدر يعرض نصه */
export function FullStory({ paragraphs }: { paragraphs: StoryParagraph[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!paragraphs.length) return null;
  return (
    <section className="card p-5 md:p-7 mb-5">
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--primary)" }}>
        القصة كاملة
      </h2>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        كل فقرة تحتها مصدرها من القرآن أو صحيح البخاري ومسلم. اضغط على المصدر لقراءته.
      </p>
      <ol className="space-y-6">
        {paragraphs.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="w-7 h-7 shrink-0 rounded-full grid place-items-center text-xs font-bold mt-1"
              style={{ background: "var(--gold-light)", color: "#3b2f0a" }}
            >
              {toArabicNum(i + 1)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base md:text-lg leading-loose">{p.text}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.sources.map((s, k) => {
                  const key = `${i}-${k}`;
                  return <SourceChip key={key} src={s} open={open === key} onClick={() => setOpen(open === key ? null : key)} />;
                })}
              </div>
              {p.sources.map((s, k) =>
                open === `${i}-${k}` ? (
                  <div key={k} className="mt-3 p-4 rounded-xl animate-fade-in" style={{ background: "var(--primary-soft)" }}>
                    <p className="font-quran text-lg leading-loose">
                      {s.kind === "quran" ? `﴿${s.text}﴾` : `«${s.text}»`}
                    </p>
                    {s.kind === "quran" ? (
                      <Link href={s.href} className="text-xs font-semibold mt-2 inline-block" style={{ color: "var(--primary)" }}>
                        اقرأ السورة
                      </Link>
                    ) : (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold mt-2 inline-block" style={{ color: "var(--primary)" }}>
                        المصدر على sunnah.com
                      </a>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
