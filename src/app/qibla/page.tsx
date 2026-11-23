import type { Metadata } from "next";
import { QiblaCompass } from "@/components/QiblaCompass";

export const metadata: Metadata = {
  title: "اتجاه القبلة",
  description: "بوصلة احترافية لتحديد اتجاه القبلة (الكعبة المشرفة) من موقعك",
};

export default function QiblaPage() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-8">
      <header className="page-band page-band--ink text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">اتجاه القبلة</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          بوصلة احترافية لتحديد اتجاه الكعبة المشرفة من موقعك الحالي. على الجوال، قم بتفعيل البوصلة لاتباع اتجاه الجهاز.
        </p>
      </header>

      <QiblaCompass />
    </section>
  );
}
