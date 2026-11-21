import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { PROPHETS, getProphet } from "@/lib/prophets";
import { getProphetStory } from "@/lib/prophet-stories";
import { toArabicNum } from "@/lib/utils";
import { OrnamentPattern, OrnamentDivider } from "@/components/prophets/Ornament";
import { StoryJourney } from "@/components/prophets/StoryJourney";
import { PlacesMap } from "@/components/prophets/PlacesMap";
import { HadithList } from "@/components/prophets/HadithList";
import { StoryQuiz } from "@/components/prophets/StoryQuiz";
import { FullStory } from "@/components/prophets/FullStory";
import { CinemaPlayerLazy as CinemaPlayer } from "@/components/prophets/cinema/CinemaPlayerLazy";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return PROPHETS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = getProphet(params.id);
  const s = getProphetStory(params.id);
  if (!p || !s) return { title: "غير موجود" };
  return { title: `قصة ${p.name} عليه السلام`, description: s.intro };
}

export default function ProphetPage({ params }: PageProps) {
  const prophet = getProphet(params.id);
  const story = getProphetStory(params.id);
  if (!prophet || !story) return notFound();

  const idx = PROPHETS.findIndex((p) => p.id === prophet.id);
  const prev = PROPHETS[idx - 1];
  const next = PROPHETS[idx + 1];
  const verseCount = story.stages.reduce((n, s) => n + s.verses.reduce((m, v) => m + v.ayat.length, 0), 0);
  const salutation = prophet.id === "muhammad" ? "ﷺ" : "عليه السلام";

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/prophets" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل الأنبياء
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-5"
        style={{ background: "linear-gradient(135deg, #14452F, #1B5E20 60%, #2E7D32)" }}
      >
        <OrnamentPattern id={`orn-${prophet.id}`} />
        <div className="relative">
          <div className="text-sm opacity-80 mb-1">قصص الأنبياء</div>
          <h1 className="font-quran text-5xl md:text-6xl font-bold mb-2">
            {prophet.name} <span className="text-2xl md:text-3xl opacity-80">{salutation}</span>
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: "rgba(200,169,81,.25)", color: "#F3E3B0" }}>
            {story.title}
          </div>
          <p className="text-base md:text-lg leading-relaxed opacity-95 max-w-2xl">{story.intro}</p>
          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/15">{toArabicNum(story.stages.length)} مراحل</span>
            <span className="px-3 py-1 rounded-full bg-white/15">{toArabicNum(verseCount)} آية</span>
            {story.hadith.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-white/15">{toArabicNum(story.hadith.length)} من الصحيحين</span>
            )}
          </div>
        </div>
      </header>

      <FullStory paragraphs={story.story} />
      {story.film.length > 0 && <CinemaPlayer shots={story.film} title={`قصة ${prophet.name} عليه السلام`} />}
      <StoryJourney stages={story.stages} />
      <PlacesMap places={story.places} />
      <HadithList items={story.hadith} />
      <StoryQuiz story={story} />

      <OrnamentDivider />
      <p className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        الآيات منقولة حرفياً من المصحف، والأحاديث بنصّها من صحيحي البخاري ومسلم مع رقم الحديث ورابطه، وكل مرجع مفحوص آلياً عند البناء.
        العناوين والجمل التعريفية تلخيص قصير للآيات نفسها.
      </p>

      <nav className="grid grid-cols-2 gap-3 mt-6">
        {prev ? (
          <Link href={`/prophets/${prev.id}`} className="card p-4 flex items-center gap-3 transition hover:-translate-y-0.5">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابق</small>
              <div className="font-bold">{prev.name}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/prophets/${next.id}`} className="card p-4 flex items-center gap-3 justify-end text-right transition hover:-translate-y-0.5">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالي</small>
              <div className="font-bold">{next.name}</div>
            </div>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
