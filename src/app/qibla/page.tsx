import type { Metadata } from "next";
import { QiblaCompass } from "@/components/QiblaCompass";
import { HeadingStar } from "@/components/zellige/Rosette";

export const metadata: Metadata = {
  title: "اتجاه القبلة",
  description: "بوصلة احترافية لتحديد اتجاه القبلة (الكعبة المشرفة) من موقعك",
};

export default function QiblaPage() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <HeadingStar />
        <h1 className="text-2xl md:text-3xl font-extrabold">اتجاه القبلة</h1>
      </div>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        بوصلة احترافية لتحديد اتجاه الكعبة المشرفة من موقعك الحالي. على الجوال، قم بتفعيل البوصلة لاتباع اتجاه الجهاز.
      </p>

      <QiblaCompass />
    </section>
  );
}
