import type { Metadata } from "next";
import Link from "next/link";
import { toArabicNum } from "@/lib/utils";
import { RECITERS } from "@/lib/reciters";
import { Mic, MapPin } from "lucide-react";
import { ReciterAvatar } from "@/components/ReciterAvatar";

export const metadata: Metadata = {
  title: "القراء",
  description: "أكثر من 20 قارئاً من أشهر قراء العالم الإسلامي",
};

export default function RecitersPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header className="page-band page-band--emerald text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">القراء</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          {toArabicNum(RECITERS.length)} قارئاً من أشهر قراء العالم الإسلامي. اختر قارئاً للاستماع لتلاوته الكاملة لأي سورة.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECITERS.map((r) => (
          <Link
            key={r.id}
            href={`/reciters/${encodeURIComponent(r.id)}`}
            className="card p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
          >
            <ReciterAvatar
              name={r.name}
              imageUrl={r.image}
              size={72}
              ring
              className="shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base mb-1 truncate">{r.name}</h2>
              <div className="text-xs flex items-center gap-3 flex-wrap" style={{ color: "var(--text-muted)" }}>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {r.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  {r.style}
                </span>
              </div>
              <div
                className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                title="جودة الصوت"
              >
                جودة {toArabicNum(parseInt(r.bitrate, 10))} ك.ب/ث
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
