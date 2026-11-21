import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS, TOPICS, SAHIHAYN_TOTAL, QUDSI_COUNT, booksForTopic, topicGlaze } from "@/lib/sahihayn";
import { SahihaynSearch } from "@/components/hadith/SahihaynSearch";
import { TileStar } from "@/components/zellige/Rosette";
import { toArabicNum } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الأحاديث النبوية: صحيح البخاري وصحيح مسلم كاملين",
  description: "كل أحاديث صحيح البخاري وصحيح مسلم بنصها العربي الكامل، مرتبة على الكتب وأبواب الفقه، مع البحث والاستماع.",
};

export default function HadithHubPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-3xl md:text-5xl mb-3">الصحيحان</h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#DCE4F6" }}>
          صحيح البخاري وصحيح مسلم كاملين بنصهما العربي، مرتبين على كتب الإمامين وعلى أبواب الفقه، مع البحث في كل حديث والاستماع إليه.
        </p>
        <div className="mt-5 inline-flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(SAHIHAYN_TOTAL)} حديثاً</span>
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(COLLECTIONS.reduce((n, c) => n + c.books.length, 0))} كتاباً</span>
        </div>
      </header>

      <SahihaynSearch />

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-4">الكتابان</h2>
      <div className="tile-wall grid md:grid-cols-2 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {COLLECTIONS.map((c) => (
          <Link
            key={c.id}
            href={`/hadith-nabawi/${c.id}`}
            className="wall-tile glaze group relative overflow-hidden p-6 md:p-8 min-h-[13rem] flex flex-col justify-between"
            style={{ backgroundColor: c.id === "bukhari" ? "#1B3A8C" : "#0E6B5A", color: "#F4F6FB" }}
          >
            <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-70" />
            <TileStar color="rgba(238,241,236,.2)" size={240} className="absolute -bottom-16 -left-16 pointer-events-none transition-transform duration-[1.4s] group-hover:rotate-45" />
            <span className="relative block text-sm" style={{ color: "#D5DEF3" }}>{c.author}</span>
            <span className="relative block">
              <span className="block font-kufic font-bold text-4xl md:text-5xl leading-tight">{c.name}</span>
              <span className="block mt-2 text-sm" style={{ color: "#D5DEF3" }}>
                {toArabicNum(c.total)} حديثاً في {toArabicNum(c.books.length)} كتاباً
              </span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-4">أبواب الفقه</h2>
      <p className="mb-4 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
        كل باب يجمع ما يقابله من كتب البخاري ومسلم معاً.
      </p>
      <div className="tile-wall grid grid-cols-2 md:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {TOPICS.map((t, i) => {
          const groups = booksForTopic(t.id);
          const books = groups.reduce((n, g) => n + g.books.length, 0);
          const count = groups.reduce((n, g) => n + g.books.reduce((m, b) => m + b.count, 0), 0);
          if (!books) return null;
          return (
            <Link
              key={t.id}
              href={`/hadith-nabawi/topic/${t.id}`}
              className="wall-tile glaze relative overflow-hidden p-4 md:p-5 min-h-[8.5rem] flex flex-col justify-between"
              style={{ backgroundColor: topicGlaze(i), color: "#F4F6FB" }}
            >
              <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-60" />
              <span className="relative text-[11px] font-semibold" style={{ color: "#D5DEF3" }}>
                {toArabicNum(books)} كتب، {toArabicNum(count)} حديثاً
              </span>
              <span className="relative font-kufic font-bold text-xl md:text-2xl leading-tight">{t.title}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/hadith-qudsi"
        className="plaster-tile glaze mt-10 p-6 md:p-8 flex items-center justify-between gap-4"
      >
        <span>
          <span className="block font-kufic font-bold text-2xl md:text-3xl">الأحاديث القدسية من الصحيحين</span>
          <span className="block mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {toArabicNum(QUDSI_COUNT)} حديثاً يرويها النبي ﷺ عن ربه عز وجل
          </span>
        </span>
        <TileStar color="var(--gold)" size={64} />
      </Link>
    </section>
  );
}
