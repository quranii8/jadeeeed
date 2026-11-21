import type { Metadata } from "next";
import { HifzTrainer } from "@/components/hifz/HifzTrainer";

export const metadata: Metadata = {
  title: "الحفظ والتسميع",
  description: "احفظ القرآن آية بآية: اسمع القارئ يكرر الآية، وأخفِ الكلمات أو أوائلها وسمّع لنفسك.",
};

export default function HifzPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-2">الحفظ والتسميع</h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          اختر الآيات والقارئ وعدد التكرار، ثم أخفِ الكلمات أو أوائلها وسمّع لنفسك.
        </p>
      </header>
      <HifzTrainer />
    </section>
  );
}
