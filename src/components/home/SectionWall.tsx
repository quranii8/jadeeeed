import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";
import { TileStar } from "@/components/zellige/Rosette";
import { RECITERS } from "@/lib/reciters";
import { TAFASIR } from "@/lib/tafasir";
import { SAHIHAYN_TOTAL, QUDSI_COUNT } from "@/lib/sahihayn";
import { ASMA_ALLAH } from "@/lib/asma-allah";
import { ADHKAR, ADHKAR_TOTAL } from "@/lib/adhkar";
import { TAJWEED_RULES } from "@/lib/tajweed";
import { QURAN_SCIENCES } from "@/lib/quran-sciences";
import { PROPHETS } from "@/lib/prophets";
import { toArabicNum } from "@/lib/utils";

type Glaze = "cobalt" | "emerald" | "saffron" | "terracotta" | "ink";
const GLAZE: Record<Glaze, { bg: string; fg: string; muted: string; line: string }> = {
  cobalt: { bg: "var(--g-cobalt)", fg: "var(--g-on)", muted: "var(--g-on-muted)", line: "rgba(238,241,236,.22)" },
  emerald: { bg: "var(--g-emerald)", fg: "var(--g-on)", muted: "var(--g-on-muted)", line: "rgba(238,241,236,.22)" },
  saffron: { bg: "var(--g-saffron)", fg: "var(--g-on-saffron)", muted: "var(--g-on-saffron-muted)", line: "rgba(26,18,4,.18)" },
  terracotta: { bg: "var(--g-terracotta)", fg: "var(--g-on)", muted: "var(--g-on-muted)", line: "rgba(238,241,236,.22)" },
  ink: { bg: "var(--g-ink)", fg: "var(--g-on)", muted: "var(--g-on-muted)", line: "rgba(238,241,236,.16)" },
};

type Section = { href: string; title: string; desc: string; icon: string; count: string; glaze: Glaze; span?: "wide" | "tall" };

const SECTIONS: Section[] = [
  { href: "/surahs", title: "المصحف", desc: "السور كاملة بالرسم العثماني مع التلاوة", icon: "book-open", count: `${toArabicNum(114)} سورة`, glaze: "cobalt", span: "wide" },
  { href: "/prophets", title: "قصص الأنبياء", desc: "القصة من الآيات والصحيحين، وفيلم لكل نبي", icon: "leaf", count: `${toArabicNum(PROPHETS.length)} نبياً`, glaze: "terracotta", span: "tall" },
  { href: "/reciters", title: "القرّاء", desc: "تلاوات متواصلة لأشهر القرّاء", icon: "mic", count: `${toArabicNum(RECITERS.length)} قارئاً`, glaze: "emerald" },
  { href: "/tafsir", title: "التفاسير", desc: "تفاسير معتمدة آية بآية", icon: "library", count: `${toArabicNum(TAFASIR.length)} تفاسير`, glaze: "saffron" },
  { href: "/hadith-nabawi", title: "صحيح البخاري ومسلم", desc: "الصحيحان كاملين، مرتبين على أبواب الفقه", icon: "scroll-text", count: `${toArabicNum(SAHIHAYN_TOTAL)} حديثاً`, glaze: "ink" },
  { href: "/hadith-qudsi", title: "الأحاديث القدسية", desc: "ما رواه النبي ﷺ عن ربه، من الصحيحين", icon: "sparkles", count: `${toArabicNum(QUDSI_COUNT)} حديثاً`, glaze: "cobalt" },
  { href: "/asma-allah", title: "أسماء الله الحسنى", desc: "الأسماء ومعانيها", icon: "sparkle", count: `${toArabicNum(ASMA_ALLAH.length)} اسماً`, glaze: "emerald", span: "wide" },
  { href: "/adhkar", title: "الأذكار", desc: "حصن المسلم كاملاً مع العدّاد", icon: "hand-heart", count: `${toArabicNum(ADHKAR_TOTAL)} ذكراً`, glaze: "saffron" },
  { href: "/prayer-times", title: "مواقيت الصلاة", desc: "حسب موقعك", icon: "mosque", count: "اليوم", glaze: "terracotta" },
  { href: "/qibla", title: "اتجاه القبلة", desc: "بوصلة من هاتفك", icon: "compass", count: "البوصلة", glaze: "ink" },
  { href: "/tajweed", title: "أحكام التجويد", desc: "الأحكام بأمثلة من الآيات", icon: "audio-waveform", count: `${toArabicNum(TAJWEED_RULES.length)} حكماً`, glaze: "cobalt" },
  { href: "/khatma", title: "ختمتي", desc: "ورد يومي حتى تختم القرآن", icon: "target", count: "الورد", glaze: "ink" },
  { href: "/hifz", title: "الحفظ والتسميع", desc: "كرّر الآية وأخفِ الكلمات", icon: "repeat", count: "تسميع", glaze: "saffron" },
  { href: "/quran-search", title: "البحث في القرآن", desc: "في الآيات كلها بأي كلمة", icon: "search", count: `${toArabicNum(6236)} آية`, glaze: "terracotta" },
  { href: "/hijri", title: "التقويم الهجري", desc: "التاريخ والمناسبات القادمة", icon: "moon-star", count: "اليوم", glaze: "cobalt" },
  { href: "/quran-sciences", title: "علوم القرآن", desc: "النزول، والمكي والمدني، والقراءات", icon: "book-open", count: `${toArabicNum(QURAN_SCIENCES.length)} علوم`, glaze: "emerald", span: "wide" },
];

/**
 * Every section is a glazed tile set into one wall. The grout between them is the
 * page ground showing through, so the wall reads as one mosaic, not a card grid.
 */
export function SectionWall() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-5 pt-10 md:pt-6" aria-labelledby="wall-title">
      <h2 id="wall-title" className="font-kufic font-bold text-3xl md:text-3xl mb-5 md:mb-4" style={{ color: "var(--text)" }}>
        أقسام المنصة
      </h2>
      <div className="tile-wall grid grid-cols-2 md:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall, #CBD3CA)" }}>
        {SECTIONS.map((s, i) => {
          const g = GLAZE[s.glaze];
          const span = s.span === "wide" ? "col-span-2" : s.span === "tall" ? "row-span-2" : "";
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`wall-tile glaze group relative flex flex-col justify-between p-4 md:p-5 min-h-[9.5rem] md:min-h-[11rem] ${span}`}
              style={{ background: g.bg, color: g.fg, ["--i" as string]: i } as React.CSSProperties}
            >
              <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-70" />
              <TileStar
                color={g.line}
                size={s.span ? 220 : 150}
                className="absolute -bottom-10 -left-10 pointer-events-none transition-transform duration-[1.4s] ease-out group-hover:rotate-45"
              />
              <span className="relative flex items-start justify-between gap-2">
                <span className="text-2xl" aria-hidden="true"><AppIcon name={s.icon} /></span>
                <span className="text-[11px] md:text-xs font-semibold px-2 py-0.5" style={{ color: g.fg, border: `1px solid ${g.line}` }}>
                  {s.count}
                </span>
              </span>
              <span className="relative block">
                <span className={`block font-kufic font-bold leading-tight ${s.span ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>{s.title}</span>
                <span className="block mt-1 text-xs md:text-sm leading-relaxed" style={{ color: g.muted }}>{s.desc}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
