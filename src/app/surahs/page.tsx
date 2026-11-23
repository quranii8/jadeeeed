import type { Metadata } from "next";
import { SurahsBrowser } from "@/components/SurahsBrowser";

export const metadata: Metadata = {
  title: "قائمة السور",
  description: "تصفح جميع سور القرآن الكريم الـ 114 مع الفلاتر والبحث",
};

export default function SurahsPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">سور القرآن الكريم</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          ١١٤ سورة كاملة — اختر السورة لقراءتها بالخط العثماني والاستماع إليها.
        </p>
      </header>
      <SurahsBrowser />
    </section>
  );
}
