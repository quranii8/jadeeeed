import { toArabicNum } from "@/lib/utils";
import type { Metadata } from "next";
import { ASMA_ALLAH } from "@/lib/asma-allah";
import { AsmaAllahBrowser } from "@/components/AsmaAllahBrowser";
import { AppIcon } from "@/components/AppIcon";

export const metadata: Metadata = {
  title: "أسماء الله الحسنى",
  description: "أسماء الله الحسنى التسعة والتسعون مع الشرح والمعنى",
};

export default function AsmaAllahPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      {/* Header مزخرف */}
      <header
        className="page-band page-band--emerald text-center relative overflow-hidden mb-8"
      >
        <div className="zellige-lattice absolute inset-0 pointer-events-none" />
        <div className="relative">
          <div className="text-5xl mb-3"><AppIcon name="sparkles" /></div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">أسماء الله الحسنى</h1>
          <p className="font-hafs text-2xl md:text-3xl leading-loose max-w-2xl mx-auto" lang="ar">
            ﴿وَلِلَّهِ ٱلۡأَسۡمَآءُ ٱلۡحُسۡنَىٰ فَٱدۡعُوهُ بِهَاۖ﴾
          </p>
          <div className="text-sm opacity-80 mt-2">سورة الأعراف، من الآية ١٨٠</div>
          <p className="mt-4 text-sm max-w-xl mx-auto" style={{ color: "var(--g-on-muted)" }}>لكل اسم معناه وشرحه، والآيات التي ورد فيها لفظه من المصحف.</p>
          <div className="inline-block mt-4 px-5 py-2 rounded bg-white/15 text-sm">
            {toArabicNum(ASMA_ALLAH.length)} اسماً مع الشرح
          </div>
        </div>
      </header>

      <AsmaAllahBrowser names={ASMA_ALLAH} />
    </section>
  );
}
