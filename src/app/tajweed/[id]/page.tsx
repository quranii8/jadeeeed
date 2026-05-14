import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TAJWEED_RULES, getTajweedRule } from "@/lib/tajweed";
import { ArrowRight, Mic, AlertTriangle, CheckCircle, Target, BookOpen, Lightbulb } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return TAJWEED_RULES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const r = getTajweedRule(params.id);
  if (!r) return { title: "غير موجود" };
  return { title: r.title, description: r.shortDesc };
}

export default function TajweedRulePage({ params }: PageProps) {
  const rule = getTajweedRule(params.id);
  if (!rule) return notFound();

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/tajweed" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل الأحكام
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
      >
        <div className="text-sm opacity-90 mb-1">{rule.category}</div>
        <div className="text-5xl mb-3">{rule.icon}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{rule.title}</h1>
        <p className="opacity-95 text-base md:text-lg">{rule.shortDesc}</p>
      </header>

      {/* التعريف */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#0ea5e9" }}>
          <BookOpen className="w-6 h-6" />
          التعريف
        </h2>
        <p className="text-base leading-loose">{rule.definition}</p>
      </div>

      {/* النطق الصحيح */}
      {rule.pronunciation && (
        <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid #8b5cf6" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#8b5cf6" }}>
            <Mic className="w-6 h-6" />
            النطق الصحيح
          </h2>
          <p className="text-base leading-loose">{rule.pronunciation}</p>
        </div>
      )}

      {/* الأصل اللغوي */}
      {rule.origin && (
        <div className="card p-6 md:p-8 mb-5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
            <Lightbulb className="w-6 h-6" />
            الأصل اللغوي
          </h2>
          <p className="text-base leading-loose">{rule.origin}</p>
        </div>
      )}

      {/* وقت التطبيق */}
      {rule.timing && (
        <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid #f59e0b" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#f59e0b" }}>
            <Target className="w-6 h-6" />
            وقت التطبيق
          </h2>
          <p className="text-base leading-loose">{rule.timing}</p>
        </div>
      )}

      {/* الحروف */}
      {rule.letters && rule.letters.length > 0 && (
        <div className="card p-6 md:p-8 mb-5">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            الحروف affected
          </h2>
          <div className="flex flex-wrap gap-2">
            {rule.letters.map((letter, i) => (
              <span
                key={i}
                className="w-10 h-10 rounded-xl grid place-items-center text-xl font-bold"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* القواعد */}
      {rule.rules && rule.rules.length > 0 && (
        <div className="card p-6 md:p-8 mb-5">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            القواعد
          </h2>
          <ul className="space-y-2">
            {rule.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-base leading-relaxed">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* الأمثلة */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--gold-dark)" }}>
          <BookOpen className="w-6 h-6" />
          أمثلة من القرآن
        </h2>
        <div className="space-y-4">
          {rule.examples.map((ex, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl"
              style={{ background: "var(--bg-soft)", borderRight: "4px solid var(--gold)" }}
            >
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "var(--gold)", color: "white" }}
              >
                {ex.rule}
              </div>
              <div
                className="font-quran text-3xl md:text-4xl leading-loose text-center my-4"
                style={{ color: "var(--primary)" }}
              >
                {ex.example}
              </div>
              <p className="text-sm leading-relaxed text-center" style={{ color: "var(--text-muted)" }}>
                {ex.explanation}
              </p>
              {ex.reading && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    كيفية القراءة:
                  </div>
                  <p className="text-sm text-center" style={{ color: "#0ea5e9" }}>
                    {ex.reading}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* النصائح */}
      {rule.tips && rule.tips.length > 0 && (
        <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid #10b981" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#10b981" }}>
            <CheckCircle className="w-6 h-6" />
            نصائح للتطبيق
          </h2>
          <div className="space-y-3">
            {rule.tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(16,185,129,.06)" }}>
                <span className="text-xl">✓</span>
                <p className="text-sm leading-relaxed flex-1">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الأخطاء الشائعة */}
      {rule.commonMistakes && rule.commonMistakes.length > 0 && (
        <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid #ef4444" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#ef4444" }}>
            <AlertTriangle className="w-6 h-6" />
            الأخطاء الشائعة
          </h2>
          <div className="space-y-3">
            {rule.commonMistakes.map((mistake, i) => (
              <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,.06)" }}>
                <span className="text-xl">✗</span>
                <p className="text-sm leading-relaxed flex-1">{mistake}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* التمرين */}
      {rule.exercise && (
        <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid #6366f1" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#6366f1" }}>
            <Target className="w-6 h-6" />
            تمرين تطبيقي
          </h2>
          <p className="text-base mb-4">{rule.exercise.instruction}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rule.exercise.examples.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-xl text-center font-quran text-2xl"
                style={{ background: "var(--bg-soft)", color: "var(--primary)" }}
              >
                {ex}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الأحكام المرتبطة */}
      {rule.relatedRules && rule.relatedRules.length > 0 && (
        <div className="card p-6 md:p-8 mb-5">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            أحكام ذات صلة
          </h2>
          <div className="flex flex-wrap gap-2">
            {rule.relatedRules.map((rr) => (
              <Link
                key={rr}
                href={`/tajweed/${rr}`}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {rr}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ملاحظات */}
      {rule.notes && (
        <div
          className="card p-5 md:p-6 mb-5"
          style={{ borderRight: "4px solid #d97706", background: "rgba(217,119,6,.04)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold mb-2" style={{ color: "#d97706" }}>ملاحظة مهمة</div>
              <p className="text-sm leading-relaxed">{rule.notes}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}