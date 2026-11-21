import Link from "next/link";
import { RECITERS } from "@/lib/reciters";
import { ChevronLeft } from "lucide-react";
import { ReciterAvatar } from "@/components/ReciterAvatar";

const GLAZES = ["var(--g-cobalt)", "var(--g-emerald)", "var(--g-terracotta)", "var(--g-deep)"];

/** The reciters as a run of glazed tiles in the wall's grammar. */
export function RecitersHighlight() {
  const featured = RECITERS.slice(0, 8);

  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-5 pt-14 md:pt-20" aria-labelledby="reciters-title">
      <div className="flex items-end justify-between gap-4 mb-5 md:mb-6 flex-wrap">
        <h2 id="reciters-title" className="font-kufic font-bold text-3xl md:text-4xl">القرّاء</h2>
        <Link href="/reciters" className="text-sm font-semibold flex items-center gap-1 hover:underline" style={{ color: "var(--primary)" }}>
          كل القرّاء
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="tile-wall grid grid-cols-2 md:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {featured.map((r, i) => (
          <Link
            key={r.id}
            href={`/reciters/${encodeURIComponent(r.id)}`}
            className="wall-tile glaze group relative flex items-center gap-3 p-3 md:p-4 min-h-[5.5rem]"
            style={{ backgroundColor: GLAZES[i % GLAZES.length], color: "var(--g-on)" }}
          >
            <span className="zellige-lattice absolute inset-0 pointer-events-none opacity-60" />
            <span className="relative shrink-0">
              <ReciterAvatar name={r.name} imageUrl={r.image} size={52} />
            </span>
            <span className="relative min-w-0">
              <span className="block font-bold text-sm leading-snug">{r.name}</span>
              <span className="block text-xs mt-0.5" style={{ color: "var(--g-on-muted)" }}>{r.country}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
