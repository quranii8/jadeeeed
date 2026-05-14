import type { Metadata } from "next";
import { HADITH_NABAWI } from "@/lib/hadith-nabawi";
import { HadithNabawiBrowser } from "@/components/HadithNabawiBrowser";

export const metadata: Metadata = {
  title: "الأحاديث النبوية الشريفة",
  description:
    "مختارات من أحاديث النبي ﷺ المروية في الصحيح والسنن - أحاديث نبوية شريفة في العقيدة والعبادة والأخلاق",
};

export default function HadithNabawiPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="pattern"
                patternUnits="userSpaceOnUse"
                width="20"
                height="20"
              >
                <path
                  d="M10 0 L0 10 L10 20 L20 10 Z"
                  fill="white"
                  fillOpacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="text-5xl mb-3">📿</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          الأحاديث النبوية الشريفة
        </h1>
        <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
          مختارات من أحاديث النبي ﷺ المأثورة عن الصحيحين والسنن
        </p>
        <div className="inline-block mt-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
          {HADITH_NABAWI.length} حديثاً نبوياً مختاراً
        </div>
      </header>

      {/* تعريف الحديث النبوي */}
      <div
        className="card p-5 mb-6"
        style={{ borderRight: "4px solid var(--primary)", background: "var(--primary-soft)" }}
      >
        <p className="text-sm leading-relaxed">
          ✦ <strong>تعريف الحديث النبوي:</strong> ما传给 النبي ﷺ من أقوال وأفعال
          وتقريرات وصفات. والأحاديث النبوية الشريفة المصدر الثاني للتشريع الإسلامي
          بعد القرآن الكريم، وهي وحي من الله تعالى يُلقيه على رسوله ﷺ.
        </p>
      </div>

      {/* المتصفح */}
      <HadithNabawiBrowser hadiths={HADITH_NABAWI} />

      {/* Footer info */}
      <div
        className="mt-8 p-6 rounded-2xl text-center"
        style={{ background: "var(--bg-soft)" }}
      >
        <h3 className="font-bold mb-2" style={{ color: "var(--text)" }}>
          📚 مصادر الأحاديث
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          الصحيحين (البخاري ومسلم)، والسنن الأربعة (أبي داود، والترمذي، والنسائي،
          وابن ماجه)، ومسند أحمد
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {["صحيح البخاري", "صحيح مسلم", "الترمذي", "أبي داود", "النسائي", "أحمد"].map(
            (source) => (
              <span
                key={source}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: "var(--surface)",
                  color: "var(--primary)",
                }}
              >
                {source}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
