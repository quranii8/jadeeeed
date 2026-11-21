import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import stats from "@/lib/quran-stats.json";
import { SurahStatsTable } from "@/components/SurahStatsTable";
import { toArabicNum } from "@/lib/utils";

export const metadata: Metadata = {
  title: "القرآن بالأرقام",
  description: "عدد السور والآيات والكلمات والحروف، والمكي والمدني، وسجدات التلاوة، والحروف المقطعة، وأطول آية، وأكثر الكلمات وروداً، محسوبة من نص المصحف.",
};

const fmt = (n: number) => toArabicNum(n.toLocaleString("en-US").replace(/,/g, "٬"));

export default function QuranNumbersPage() {
  const t = stats.totals;
  const big = [
    { n: t.surahs, label: "سورة", g: "var(--g-cobalt)" },
    { n: t.ayat, label: "آية", g: "var(--g-emerald)" },
    { n: t.words, label: "كلمة", g: "var(--g-terracotta)" },
    { n: t.letters, label: "حرفاً", g: "var(--g-ink)" },
  ];
  const makkiPct = Math.round((t.makkiAyat / t.ayat) * 100);
  const maxTop = stats.top[0].n;
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <Link href="/quran-sciences" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "var(--primary)" }}>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
        علوم القرآن
      </Link>
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-2">القرآن بالأرقام</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          كل رقم هنا محسوب من نص المصحف برواية حفص الذي يقرأ منه الموقع.
        </p>
      </header>

      <div className="tile-wall grid grid-cols-2 md:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {big.map((b) => (
          <div key={b.label} className="wall-tile relative overflow-hidden p-5 md:p-7" style={{ backgroundColor: b.g, color: "var(--g-on)" }}>
            <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-60" />
            <div className="relative font-kufic font-bold text-3xl md:text-5xl leading-none">{fmt(b.n)}</div>
            <div className="relative mt-2 text-sm" style={{ color: "var(--g-on-muted)" }}>{b.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }}>
        عدد الكلمات والحروف يختلف بين العادّين بحسب ما يُعدّ كلمة وحرفاً، وهذا العدد بحسب رسم هذا النص.
      </p>

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-4">المكي والمدني</h2>
      <div className="plaster-tile p-5 md:p-7">
        <div className="flex h-10 rounded overflow-hidden text-sm font-bold">
          <div className="grid place-items-center" style={{ width: `${makkiPct}%`, background: "var(--gold)", color: "var(--g-on-saffron)" }}>
            مكية {toArabicNum(makkiPct)}٪
          </div>
          <div className="grid place-items-center flex-1" style={{ background: "var(--emerald)", color: "var(--g-on)" }}>
            مدنية {toArabicNum(100 - makkiPct)}٪
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <p><strong>{toArabicNum(t.makki)} سورة مكية</strong> فيها {fmt(t.makkiAyat)} آية.</p>
          <p><strong>{toArabicNum(t.madani)} سورة مدنية</strong> فيها {fmt(t.madaniAyat)} آية.</p>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }}>بحسب التصنيف المعتمد في المصحف، وفي بعض السور خلاف بين العلماء.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div>
          <h2 className="font-kufic font-bold text-3xl mb-4">أطول آية</h2>
          <Link href={`/surah/${stats.longestAyah.s}#verse-${stats.longestAyah.a}`} className="plaster-tile glaze block p-5 md:p-6">
            <div className="font-kufic font-bold text-2xl">آية الدَّين</div>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              سورة {stats.longestAyah.name}، الآية {toArabicNum(stats.longestAyah.a)}: {toArabicNum(stats.longestAyah.words)} كلمة و{toArabicNum(stats.longestAyah.letters)} حرفاً.
            </p>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            وفي المصحف {toArabicNum(t.oneWordAyat)} آيات من كلمة واحدة، غير الحروف المقطعة.
          </p>
        </div>
        <div>
          <h2 className="font-kufic font-bold text-3xl mb-4">سجدات التلاوة ({toArabicNum(stats.sajdat.length)})</h2>
          <ol className="tile-wall grid grid-cols-2 sm:grid-cols-3 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
            {stats.sajdat.map((x, i) => (
              <li key={i} className="contents">
                <Link href={`/surah/${x.s}#verse-${x.a}`} className="plaster-tile glaze p-3 text-sm">
                  <span className="block font-bold">{x.name}</span>
                  <span className="block text-xs" style={{ color: "var(--text-muted)" }}>الآية {toArabicNum(x.a)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-2">الحروف المقطعة</h2>
      <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(stats.muqattaat.length)} سورة تُفتتح بحروف مقطعة، من أربعة عشر حرفاً.
      </p>
      <div className="tile-wall grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {stats.muqattaat.map((m) => (
          <Link key={m.n} href={`/surah/${m.n}`} className="plaster-tile glaze p-3 text-center">
            <span className="block font-hafs text-2xl leading-loose" style={{ color: "var(--primary)" }}>{m.letters}</span>
            <span className="block text-xs" style={{ color: "var(--text-muted)" }}>{m.name}</span>
          </Link>
        ))}
      </div>

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-2">أكثر الكلمات وروداً</h2>
      <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>الكلمة كما رُسمت، بلا تشكيل، ومع ما اتصل بها من حروف.</p>
      <div className="plaster-tile p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        {stats.top.slice(0, 45).map((x, i) => (
          <div key={x.w} className="flex items-center gap-3 text-sm">
            <span className="w-6 text-xs tabular-nums" style={{ color: "var(--text-soft)" }}>{toArabicNum(i + 1)}</span>
            <span className="w-20 font-bold font-quran text-base">{x.w}</span>
            <span className="flex-1 h-2 rounded" style={{ background: "var(--bg-soft)" }}>
              <span className="block h-2 rounded" style={{ width: `${(x.n / maxTop) * 100}%`, background: "var(--gold)" }} />
            </span>
            <span className="w-12 text-left tabular-nums text-xs font-semibold">{toArabicNum(x.n)}</span>
          </div>
        ))}
      </div>

      <h2 className="font-kufic font-bold text-3xl mt-12 mb-4">السور كلها بالأرقام</h2>
      <SurahStatsTable rows={stats.surahs} />
    </section>
  );
}
