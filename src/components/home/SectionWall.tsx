import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";
import { HeadingStar, Vine, leafPath } from "@/components/zellige/Rosette";
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
const MARBLE = { bg: "linear-gradient(180deg,#FFFFFF 0%,#F3F4F0 100%)", fg: "#10241C", muted: "#5F6E72", line: "rgba(184,137,58,.45)", accent: "var(--g-cobalt)" };
const GLAZE: Record<Glaze, { bg: string; fg: string; muted: string; line: string; accent: string }> = {
  cobalt: { bg: "var(--g-cobalt)", fg: "#F7F5EC", muted: "rgba(247,245,236,.72)", line: "rgba(212,175,90,.5)", accent: "var(--g-saffron-light)" },
  emerald: MARBLE,
  saffron: MARBLE,
  terracotta: MARBLE,
  ink: { bg: "var(--g-deep)", fg: "#F7F5EC", muted: "rgba(247,245,236,.72)", line: "rgba(212,175,90,.5)", accent: "var(--g-saffron-light)" },
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
 * Every section is an arch of the Rawdah: white marble bays and green garden bays
 * alternate along one arcade, each framed by a gold hairline. Pressing an arch
 * unfurls a gold leaf at its apex.
 */
export function SectionWall() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-5 pt-10 md:pt-6" aria-labelledby="wall-title">
      <div className="flex items-center gap-3 mb-6 md:mb-7">
        <HeadingStar size={28} />
        <h2 id="wall-title" className="font-kufic font-bold text-3xl md:text-[2.1rem]" style={{ color: "var(--text)" }}>
          أقسام المنصة
        </h2>
        <span className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(154,165,168,0), rgba(154,165,168,.7))" }} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {SECTIONS.map((s, i) => {
          const g = GLAZE[s.glaze];
          const span = s.span === "wide" ? "col-span-2" : s.span === "tall" ? "row-span-2" : "";
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`wall-tile glaze group relative flex flex-col justify-between items-center text-center px-4 pt-14 pb-6 md:px-5 md:pt-16 min-h-[12rem] md:min-h-[14rem] overflow-hidden ${span}`}
              style={{ background: g.bg, color: g.fg, ["--i" as string]: i, boxShadow: "0 1px 0 rgba(154,165,168,.5), 0 18px 40px -28px rgba(7,51,38,.45)" } as React.CSSProperties}
            >
              {g === MARBLE ? (
                <span className="zellige-lattice-ink absolute inset-0 pointer-events-none" />
              ) : (
                <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-60" />
              )}
              <svg viewBox="-14 -30 28 32" className="arch-leaf absolute top-3 left-1/2 -translate-x-1/2 w-5 h-6 pointer-events-none" aria-hidden="true">
                <path d={leafPath(26, 0.44)} fill="var(--g-saffron)" />
              </svg>
              {s.span === "tall" && (
                <Vine className="absolute left-1/2 -translate-x-1/2 bottom-[8.5rem] top-[8.5rem] w-10 opacity-80 pointer-events-none" leaves={6} />
              )}
              <span className="relative flex flex-col items-center gap-2">
                <span className="text-2xl" aria-hidden="true" style={{ color: g.accent }}><AppIcon name={s.icon} /></span>
                <span className="text-[11px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: g.fg, border: `1px solid ${g.line}` }}>
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
