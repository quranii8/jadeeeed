import type { Metadata } from "next";
import { SurahsBrowser } from "@/components/SurahsBrowser";
import { HeadingStar } from "@/components/zellige/Rosette";

export const metadata: Metadata = {
  title: "قائمة السور",
  description: "تصفح جميع سور القرآن الكريم الـ 114 مع الفلاتر والبحث",
};

export default function SurahsPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <HeadingStar />
        <h1 className="text-2xl md:text-3xl font-extrabold">سور القرآن الكريم</h1>
      </div>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        ١١٤ سورة كاملة — اختر السورة لقراءتها بالخط العثماني والاستماع إليها.
      </p>
      <SurahsBrowser />
    </section>
  );
}
