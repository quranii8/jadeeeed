import type { Metadata } from "next";
import { KhatmaPlanner } from "@/components/khatma/KhatmaPlanner";

export const metadata: Metadata = {
  title: "ختمتي والورد اليومي",
  description: "خطة لختم القرآن في المدة التي تختارها، بورد يومي متساوٍ ومتابعة لتقدّمك وأيامك المتتالية.",
};

export default function KhatmaPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--emerald text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-2">ختمتي</h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "#D9EFE8" }}>
          اختر المدة، ونعطيك ورد كل يوم، وتابع تقدّمك حتى تختم. كل شيء محفوظ على جهازك.
        </p>
      </header>
      <KhatmaPlanner />
    </section>
  );
}
