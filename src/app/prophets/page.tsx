import type { Metadata } from "next";
import Link from "next/link";
import { PROPHETS } from "@/lib/prophets";
import { ChevronLeft } from "lucide-react";
import { PROPHET_STORIES } from "@/lib/prophet-stories";
import { OrnamentPattern } from "@/components/prophets/Ornament";
import { toArabicNum } from "@/lib/utils";

const storyOf = (id: string) => PROPHET_STORIES.find((s) => s.id === id);

export const metadata: Metadata = {
  title: "قصص الأنبياء",
  description: "قصص الأنبياء والمرسلين عليهم السلام من القرآن والسنة",
};

export default function ProphetsPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #14452F, #1B5E20 60%, #2E7D32)" }}
      >
        <OrnamentPattern id="orn-prophets" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">قصص الأنبياء عليهم السلام</h1>
          <p className="font-hafs text-2xl md:text-3xl opacity-95 max-w-2xl mx-auto leading-loose">
            ﴿لَقَدۡ كَانَ فِي قَصَصِهِمۡ عِبۡرَةٞ لِّأُوْلِي ٱلۡأَلۡبَٰبِ﴾
          </p>
          <div className="text-sm opacity-80 mt-1">[يوسف: ١١١]</div>
          <p className="mt-5 text-sm opacity-90 max-w-xl mx-auto">
            كل قصة رحلة تفاعلية بآيات القرآن نفسها وتلاوتها، مع ما صحّ في البخاري ومسلم، وخريطة للأماكن، واختبار قصير.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROPHETS.map((p) => (
          <Link
            key={p.id}
            href={`/prophets/${p.id}`}
            className="card p-5 transition-all hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
            />
            <div className="flex items-start gap-3 relative">
              <div
                className="w-14 h-14 rounded-xl grid place-items-center text-2xl shrink-0 font-bold text-white shadow-md transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl mb-0.5">{p.name}</h2>
                <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  {p.id === "muhammad" ? "ﷺ" : "عليه السلام"} • {toArabicNum(storyOf(p.id)?.stages.length ?? 0)} مراحل
                </div>
                {storyOf(p.id)?.title && (
                  <div
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                    style={{ background: "rgba(22,163,74,.15)", color: "#16a34a" }}
                  >
                    {storyOf(p.id)?.title}
                  </div>
                )}
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
                  {storyOf(p.id)?.intro}
                </p>
                <div
                  className="mt-2 text-xs font-semibold flex items-center gap-1"
                  style={{ color: "#16a34a" }}
                >
                  اقرأ القصة
                  <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
