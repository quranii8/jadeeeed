import type { Metadata } from "next";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";

export const metadata: Metadata = {
  title: "مواقيت الصلاة",
  description: "مواقيت الصلاة الدقيقة حسب موقعك الجغرافي",
};

export default function PrayerTimesPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-8">
      <header className="page-band page-band--terracotta text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">مواقيت الصلاة</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          مواقيت الصلاة الدقيقة حسب موقعك الجغرافي — اسمح للموقع باستخدام مكانك للحصول على أوقات صحيحة.
        </p>
      </header>

      <PrayerTimesWidget />
    </section>
  );
}
