import type { Metadata } from "next";
import { QuranSearch } from "@/components/QuranSearch";

export const metadata: Metadata = {
  title: "البحث في القرآن",
  description: "ابحث في آيات القرآن الكريم كلها بأي كلمة.",
};

export default function QuranSearchPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-2">البحث في القرآن</h1>
        <p className="text-base" style={{ color: "var(--g-on-muted)" }}>في الآيات كلها، ٦٢٣٦ آية</p>
      </header>
      <QuranSearch />
    </section>
  );
}
