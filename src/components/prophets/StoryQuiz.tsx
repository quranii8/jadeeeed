"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { PROPHET_STORIES, type ProphetStory } from "@/lib/prophet-stories";
import { toArabicNum } from "@/lib/utils";

interface Q {
  prompt: string;
  quote: string;
  options: string[];
  answer: number;
}

/** مولّد عشوائي ثابت حسب النبي، حتى تتطابق الأسئلة بين الخادم والمتصفح */
function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const shortQuote = (t: string) => t.split(" ").slice(0, 9).join(" ") + (t.split(" ").length > 9 ? " …" : "");
const cleanSurah = (n: string) => n.replace(/^سورة\s*/, "");

/**
 * أسئلة مبنية من بيانات القصة نفسها فقط (الآيات وأسماء السور ومراحل القصة)،
 * فلا يوجد فيها معلومة لم تُفحص.
 */
function buildQuiz(story: ProphetStory): Q[] {
  const r = rng(story.id);
  const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let k = a.length - 1; k > 0; k--) {
      const j = Math.floor(r() * (k + 1));
      [a[k], a[j]] = [a[j], a[k]];
    }
    return a;
  };
  const allSurahs = Array.from(
    new Set(PROPHET_STORIES.flatMap((p) => p.stages.flatMap((s) => s.verses.map((v) => cleanSurah(v.surahName)))))
  );
  const qs: Q[] = [];
  const stages = shuffle(story.stages.map((s, i) => ({ s, i })));
  for (const { s } of stages) {
    if (qs.length >= 4) break;
    const v = pick(s.verses);
    const ayah = pick(v.ayat);
    const quote = shortQuote(ayah.text);
    if (qs.length % 2 === 0 || story.stages.length < 3) {
      const correct = cleanSurah(v.surahName);
      const wrong = shuffle(allSurahs.filter((x) => x !== correct)).slice(0, 3);
      const options = shuffle([correct, ...wrong]);
      qs.push({ prompt: "في أي سورة وردت هذه الآية؟", quote, options, answer: options.indexOf(correct) });
    } else {
      const correct = s.title;
      const wrong = shuffle(story.stages.map((x) => x.title).filter((x) => x !== correct)).slice(0, 3);
      const options = shuffle([correct, ...wrong]);
      qs.push({ prompt: "عن أي مرحلة من القصة تتحدث هذه الآية؟", quote, options, answer: options.indexOf(correct) });
    }
  }
  return qs;
}

export function StoryQuiz({ story }: { story: ProphetStory }) {
  const quiz = useMemo(() => buildQuiz(story), [story]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  if (!quiz.length) return null;
  const done = i >= quiz.length;
  const q = quiz[Math.min(i, quiz.length - 1)];

  const choose = (k: number) => {
    if (chosen !== null) return;
    setChosen(k);
    if (k === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setChosen(null);
    setI(i + 1);
  };
  const reset = () => {
    setI(0);
    setChosen(null);
    setScore(0);
  };

  return (
    <section className="card p-5 md:p-7 mb-5">
      <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
        اختبر نفسك
      </h2>
      {done ? (
        <div className="text-center py-6">
          <div className="text-4xl font-bold mb-2" style={{ color: "var(--gold-dark)" }}>
            {toArabicNum(score)} / {toArabicNum(quiz.length)}
          </div>
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            {score === quiz.length ? "ممتاز! أجبت عن كل الأسئلة صحيحاً" : "أعد قراءة رحلة القصة وجرّب مرة ثانية"}
          </p>
          <button onClick={reset} className="btn btn-outline">
            <RotateCcw className="w-4 h-4" /> أعد الاختبار
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
            السؤال {toArabicNum(i + 1)} من {toArabicNum(quiz.length)} — {q.prompt}
          </p>
          <p className="font-hafs text-xl leading-loose mb-4 p-4 rounded-xl" style={{ background: "var(--primary-soft)" }}>
            ﴿{q.quote}﴾
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((o, k) => {
              const state = chosen === null ? "idle" : k === q.answer ? "right" : k === chosen ? "wrong" : "idle";
              return (
                <button
                  key={o}
                  onClick={() => choose(k)}
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-right font-medium transition-colors"
                  style={{
                    borderColor: state === "right" ? "#0E6B5A" : state === "wrong" ? "#dc2626" : "var(--border)",
                    background: state === "right" ? "#0E6B5A1a" : state === "wrong" ? "#dc26261a" : "transparent",
                  }}
                >
                  {o}
                  {state === "right" && <Check className="w-4 h-4 text-green-600" />}
                  {state === "wrong" && <X className="w-4 h-4 text-red-600" />}
                </button>
              );
            })}
          </div>
          {chosen !== null && (
            <div className="mt-4 flex justify-end">
              <button onClick={next} className="btn btn-primary">
                {i === quiz.length - 1 ? "النتيجة" : "السؤال التالي"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
