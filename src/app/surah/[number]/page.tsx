import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurah, SURAHS } from "@/lib/surahs";
import { readFileSync } from "fs";
import path from "path";
import { stripBismillah, toArabicNum } from "@/lib/utils";
import { SurahReader } from "@/components/SurahReader";

interface PageProps {
  params: { number: string };
}

export async function generateStaticParams() {
  return SURAHS.map((s) => ({ number: String(s.n) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const num = parseInt(params.number);
  const s = getSurah(num);
  if (!s) return { title: "السورة غير موجودة" };
  return {
    title: `سورة ${s.a}`,
    description: `قراءة واستماع وتفسير سورة ${s.a} (${s.e}) — ${s.v} آية، ${s.t === "makki" ? "مكية" : "مدنية"}`,
    openGraph: {
      title: `سورة ${s.a} | منصة القرآن`,
      description: `${s.v} آية • ${s.t === "makki" ? "مكية" : "مدنية"}`,
    },
  };
}

export default async function SurahPage({ params }: PageProps) {
  const num = parseInt(params.number);
  const surah = getSurah(num);
  if (!surah) return notFound();

  // النص العثماني وترجمة Sahih International من نسخة محلية موثّقة (quran-json)،
  // فلا تتعطل أي سورة إذا تعثّر مصدر خارجي وقت البناء
  const read = (dir: string) => JSON.parse(readFileSync(path.join(process.cwd(), dir, `${num}.json`), "utf8")) as string[];
  const ar = read("public/data/quran");
  const en = read("data/quran/en");
  const verses = ar.map((text, i) => ({
    num: i + 1,
    text: i === 0 ? stripBismillah(text, num) : text,
    trans: en[i] ?? "",
  }));

  const prev = getSurah(num - 1);
  const next = getSurah(num + 1);

  return (
    <article className="max-w-5xl mx-auto px-5 py-6">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `سورة ${surah.a}`,
            description: `سورة ${surah.a} (${surah.e}) — ${surah.v} آية`,
            inLanguage: "ar",
          }),
        }}
      />

      <SurahReader surah={surah} verses={verses} prev={prev} next={next} />
    </article>
  );
}
