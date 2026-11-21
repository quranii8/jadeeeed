import type { Metadata } from "next";
import { HijriCalendar } from "@/components/HijriCalendar";

export const metadata: Metadata = {
  title: "التقويم الهجري",
  description: "التاريخ الهجري اليوم، والشهر الهجري الحالي، والمناسبات القادمة: رمضان والعيدين وعرفة وعاشوراء والأيام البيض.",
};

export default function HijriPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--terracotta text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl">التقويم الهجري</h1>
      </header>
      <HijriCalendar />
    </section>
  );
}
