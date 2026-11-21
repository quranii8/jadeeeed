"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StoryStage } from "@/lib/prophet-stories";
import { toArabicNum } from "@/lib/utils";
import { VerseCard } from "./VerseCard";

/** رحلة القصة: مراحل بالترتيب، كل مرحلة بآياتها، مع شريط تقدّم وتنقّل */
export function StoryJourney({ stages }: { stages: StoryStage[] }) {
  const [i, setI] = useState(0);
  const st = stages[i];
  const go = (n: number) => {
    setI(n);
    document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="journey" className="card p-5 md:p-7 mb-5 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          رحلة القصة
        </h2>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {toArabicNum(i + 1)} من {toArabicNum(stages.length)}
        </span>
      </div>

      {/* محطات */}
      <ol className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1" aria-label="مراحل القصة">
        {stages.map((s, k) => (
          <li key={k} className="shrink-0">
            <button
              onClick={() => go(k)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium border transition-colors whitespace-nowrap"
              style={
                k === i
                  ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                  : k < i
                    ? { background: "var(--primary-soft)", color: "var(--primary)", borderColor: "transparent" }
                    : { background: "transparent", color: "var(--text-muted)", borderColor: "var(--border)" }
              }
              aria-current={k === i ? "step" : undefined}
            >
              <span
                className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center"
                style={{ background: k === i ? "rgba(255,255,255,.25)" : "var(--bg-soft)" }}
              >
                {toArabicNum(k + 1)}
              </span>
              {s.title}
            </button>
          </li>
        ))}
      </ol>

      <div className="h-1 rounded-full mb-6" style={{ background: "var(--bg-soft)" }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${((i + 1) / stages.length) * 100}%`, background: "var(--gold)" }}
        />
      </div>

      <div key={i} className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-2">{st.title}</h3>
        <p className="mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {st.summary}
        </p>
        <div className="space-y-4">
          {st.verses.map((v, k) => (
            <VerseCard key={`${i}-${k}`} group={v} />
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="btn btn-outline disabled:opacity-40">
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>
        <button onClick={() => go(i + 1)} disabled={i === stages.length - 1} className="btn btn-primary disabled:opacity-40">
          التالي
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
