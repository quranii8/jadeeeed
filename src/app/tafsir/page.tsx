import type { Metadata } from "next";
import Link from "next/link";
import { TAFASIR } from "@/lib/tafasir";
import { ChevronLeft } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";

export const metadata: Metadata = {
  title: "التفاسير المعتمدة",
  description: "8 تفاسير معتمدة للقرآن الكريم: الميسر، الجلالين، القرطبي، الطبري، البغوي، ابن كثير، الوسيط، تنوير المقباس",
};

export default function TafsirPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header className="page-band page-band--saffron-deep text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">التفاسير المعتمدة</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          مجموعة منتقاة من أعظم تفاسير القرآن الكريم عبر التاريخ الإسلامي — من تفاسير المأثور للسلف، إلى التفاسير المعاصرة الميسّرة. اختر تفسيراً للتعرف عليه أكثر، أو استخدم خاصية <strong style={{ color: "var(--g-saffron-light)" }}>المقارنة</strong> داخل أي آية لرؤية كل التفاسير جنباً إلى جنب.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TAFASIR.map((t) => (
          <Link
            key={t.id}
            href={`/tafsir/${encodeURIComponent(t.id)}`}
            className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
            style={{ borderRight: `4px solid ${t.color}` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl grid place-items-center text-3xl shrink-0 transition-transform group-hover:scale-110"
                style={{ background: `${t.color}15`, color: t.color }}
              >
                <AppIcon name={t.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg mb-0.5">{t.name}</h2>
                <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  {t.author}
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                  {t.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    {t.approach}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-soft)" }}>
                    {t.era}
                  </span>
                  <span
                    className="mr-auto text-sm font-semibold flex items-center gap-1"
                    style={{ color: t.color }}
                  >
                    استكشاف
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
