import type { Metadata } from "next";
import Link from "next/link";
import { ADHKAR, ADHKAR_GROUPS, ADHKAR_TOTAL, HISN_SOURCE } from "@/lib/adhkar";
import { AdhkarIndex } from "@/components/AdhkarIndex";
import { toArabicNum } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";
import { HeadingStar } from "@/components/zellige/Rosette";

export const metadata: Metadata = {
  title: "الأذكار والأدعية",
  description: "حصن المسلم كاملاً: أذكار الصباح والمساء والصلاة والنوم والسفر والكرب وكل مناسبة، مع العدد والفضل والمصدر.",
};

export default function AdhkarPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--emerald text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">الأذكار والأدعية</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          كتاب حصن المسلم كاملاً بأبوابه كلها، مع عدد كل ذكر وفضله ومصدره، وعدّاد تضغطه وأنت تذكر.
        </p>
        <div className="mt-4 inline-flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(ADHKAR_TOTAL)} ذكراً</span>
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(ADHKAR.length)} باباً</span>
        </div>
      </header>

      <AdhkarIndex groups={ADHKAR_GROUPS} chapters={ADHKAR} />

      <p className="mt-8 text-xs" style={{ color: "var(--text-soft)" }}>المصدر: {HISN_SOURCE}.</p>

      {/* روابط سريعة لميزات أخرى */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/asma-allah"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl"><AppIcon name="sparkles" /></div>
          <div>
            <div className="font-bold">أسماء الله الحسنى</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>99 اسماً مع شرحها</div>
          </div>
        </Link>
        <Link
          href="/prayer-times"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl"><AppIcon name="mosque" /></div>
          <div>
            <div className="font-bold">مواقيت الصلاة</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>حسب موقعك</div>
          </div>
        </Link>
        <Link
          href="/qibla"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl"><AppIcon name="compass" /></div>
          <div>
            <div className="font-bold">اتجاه القبلة</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>بوصلة تفاعلية</div>
          </div>
        </Link>
      </div>
    </section>
  );
}
