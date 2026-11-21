import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";
import { HADITH_NABAWI } from "@/lib/hadith-nabawi";
import { HeadingStar } from "@/components/zellige/Rosette";

const CONTENT = [
  {
    href: "/prophets",
    icon: "leaf",
    title: "قصص الأنبياء",
    desc: "قصص 25 نبياً ورسولاً عليهم السلام مع الدروس المستفادة من القرآن",
    gradient: "linear-gradient(135deg, #0E6B5A, #1C8C76)",
    badge: "25 قصة",
  },
  {
    href: "/quran-sciences",
    icon: "book-open",
    title: "علوم القرآن",
    desc: "أسباب النزول، المكي والمدني، الناسخ والمنسوخ، إعجاز القرآن، والقراءات السبع",
    gradient: "linear-gradient(135deg, #1B3A8C, #2D54B8)",
    badge: "8 علوم",
  },
  {
    href: "/tajweed",
    icon: "audio-waveform",
    title: "أحكام التجويد",
    desc: "تعلّم أحكام التلاوة الصحيحة مع أمثلة عملية من القرآن الكريم",
    gradient: "linear-gradient(135deg, #1B3A8C, #2D54B8)",
    badge: "16 حكماً",
  },
  {
    href: "/hadith-qudsi",
    icon: "sparkles",
    title: "الأحاديث القدسية",
    desc: "ما يرويه النبي ﷺ عن ربه عز وجل من غير القرآن الكريم",
    gradient: "linear-gradient(135deg, #B4472F, #CF6247)",
    badge: "20 حديثاً",
  },
  {
  href: "/hadith-nabawi",
  icon: "scroll-text",
  title: "الأحاديث النبوية",
  desc: "مختارات من أحاديث النبي ﷺ المأثورة عن الصحيحين والسنن",
  gradient: "linear-gradient(135deg, #1B3A8C, #2D54B8)",
  badge: `${HADITH_NABAWI.length} حديثاً`,
},
];

export function IslamicContent() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 py-10">
      <div className="flex items-center gap-3 mb-2">
        <HeadingStar />
        <h2 className="text-xl md:text-2xl font-extrabold">محتوى تعليمي شامل</h2>
      </div>
      <p className="mb-6 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
        تعمّق في فهم دينك مع محتوى منهجي مأخوذ من المصادر الأصلية المعتمدة.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CONTENT.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card p-6 transition-all hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 transition-transform group-hover:scale-150"
              style={{ background: c.gradient }}
            />
            <div
              className="w-14 h-14 rounded-2xl text-3xl mb-4 grid place-items-center text-white shadow-md transition-transform group-hover:scale-110 relative"
              style={{ background: c.gradient }}
            >
              <AppIcon name={c.icon} />
            </div>
            <div className="flex items-center gap-2 mb-2 relative">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
              >
                {c.badge}
              </span>
            </div>
            <p className="text-sm leading-relaxed relative" style={{ color: "var(--text-muted)" }}>
              {c.desc}
            </p>
            <div
              className="mt-4 text-sm font-semibold flex items-center gap-1 relative transition-all group-hover:gap-2"
              style={{ color: "var(--primary)" }}
            >
              ابدأ الآن ←
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
