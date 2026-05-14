import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { QURAN_SCIENCES, getScience } from "@/lib/quran-sciences";
import { ArrowRight, BookOpen, Lightbulb, Star, Award, Link2 } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return QURAN_SCIENCES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const s = getScience(params.id);
  if (!s) return { title: "غير موجود" };
  return { title: s.title, description: s.shortDesc };
}

export default function ScienceDetailPage({ params }: PageProps) {
  const science = getScience(params.id);
  if (!science) return notFound();

  const idx = QURAN_SCIENCES.findIndex((s) => s.id === science.id);
  const prev = QURAN_SCIENCES[idx - 1];
  const next = QURAN_SCIENCES[idx + 1];

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/quran-sciences" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل العلوم
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
      >
        <div className="text-5xl mb-3">{science.icon}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{science.title}</h1>
        <p className="opacity-95 text-base md:text-lg">{science.shortDesc}</p>
      </header>

      {/* الوصف المطول */}
      {science.longDesc && (
        <div className="card p-6 md:p-8 mb-5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#7c3aed" }}>
            <BookOpen className="w-6 h-6" />
            نبذة شاملة
          </h2>
          <p className="text-base leading-loose">{science.longDesc}</p>
        </div>
      )}

      <div className="space-y-5">
        {science.content.map((section, i) => (
          <div key={i} className="card p-6 md:p-7">
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: "#7c3aed" }}
            >
              <span
                className="w-8 h-8 rounded-full grid place-items-center text-sm"
                style={{ background: "rgba(124,58,237,.12)" }}
              >
                {i + 1}
              </span>
              {section.heading}
            </h2>
            <p className="text-base leading-loose whitespace-pre-line">{section.text}</p>
            {section.subPoints && section.subPoints.length > 0 && (
              <ul className="mt-4 space-y-2">
                {section.subPoints.map((point, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-xs"
                      style={{ background: "rgba(124,58,237,.12)", color: "#7c3aed" }}
                    >
                      •
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* أمثلة تطبيقية */}
        {science.examples && science.examples.length > 0 && (
          <div className="card p-6 md:p-7" style={{ borderRight: "4px solid #d97706" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#d97706" }}>
              💡 أمثلة تطبيقية
            </h2>
            <div className="space-y-3">
              {science.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: "var(--bg-soft)" }}
                >
                  <div className="font-bold mb-2" style={{ color: "#d97706" }}>
                    {ex.title}
                  </div>
                  <p className="text-sm leading-relaxed">{ex.text}</p>
                  {ex.source && (
                    <div className="mt-2 pt-2 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                      المصدر: {ex.source}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* الفوائد */}
      {science.benefits && science.benefits.length > 0 && (
        <div className="card p-6 md:p-8 mt-5" style={{ borderRight: "4px solid #10b981" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#10b981" }}>
            <Award className="w-6 h-6" />
            فوائد دراسة هذا العلم
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {science.benefits.map((benefit, i) => (
              <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(16,185,129,.06)" }}>
                <span className="text-xl">✓</span>
                <span className="text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* النقاط الرئيسية */}
      {science.keyPoints && science.keyPoints.length > 0 && (
        <div className="card p-6 md:p-8 mt-5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
            <Star className="w-6 h-6" />
            النقاط الرئيسية
          </h2>
          <div className="space-y-2">
            {science.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 text-base leading-relaxed">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  {i + 1}
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الكتب المشهورة */}
      {science.famousBooks && science.famousBooks.length > 0 && (
        <div className="card p-6 md:p-8 mt-5">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            📚 كتب مشهورة في هذا العلم
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {science.famousBooks.map((book, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: "var(--bg-soft)" }}>
                <div className="font-bold mb-1">{book.name}</div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  المؤلف: {book.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* المراجع */}
      {science.references && science.references.length > 0 && (
        <div className="card p-6 md:p-8 mt-5" style={{ borderRight: "4px solid #ec4899" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ec4899" }}>
            📖 مراجع قرآنية
          </h2>
          <div className="space-y-4">
            {science.references.map((ref, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: "var(--bg-soft)" }}>
                <div
                  className="font-quran text-2xl leading-loose text-center my-2"
                  style={{ color: "var(--primary)" }}
                >
                  {ref.verse}
                </div>
                <p className="text-sm leading-relaxed text-center" style={{ color: "var(--text-muted)" }}>
                  {ref.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مواضيع ذات صلة */}
      {science.relatedTopics && science.relatedTopics.length > 0 && (
        <div className="card p-6 md:p-8 mt-5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
            <Link2 className="w-6 h-6" />
            مواضيع ذات صلة
          </h2>
          <div className="flex flex-wrap gap-2">
            {science.relatedTopics.map((topic) => {
              const t = getScience(topic);
              if (!t) return null;
              return (
                <Link
                  key={topic}
                  href={`/quran-sciences/${topic}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  {t.icon} {t.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* تنقل */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        {prev ? (
          <Link href={`/quran-sciences/${prev.id}`} className="card p-4 flex items-center gap-3 hover:border-purple-600 transition">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابق</small>
              <div className="font-bold">{prev.title}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/quran-sciences/${next.id}`} className="card p-4 flex items-center gap-3 justify-end text-right hover:border-purple-600 transition">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالي</small>
              <div className="font-bold">{next.title}</div>
            </div>
            <span className="text-lg">←</span>
          </Link>
        ) : <div />}
      </div>
    </article>
  );
}