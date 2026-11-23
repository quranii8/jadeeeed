import Link from "next/link";
import { Play } from "lucide-react";

/** A horseshoe-arch window onto the night the prophets' films are drawn in: no people, only light. */
function ArchWindow() {
  const stars = Array.from({ length: 34 }, (_, i) => {
    const x = 30 + ((i * 97) % 300);
    const y = 40 + ((i * 53) % 170);
    return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.8 : 1.1} style={{ fill: "var(--g-on)" }} opacity={0.5 + (i % 3) * 0.2} />;
  });
  return (
    <svg viewBox="0 0 360 460" className="w-full h-auto" role="img" aria-label="نافذة على ليل الصحراء ونور في الأفق">
      <defs>
        <clipPath id="arch">
          <path d="M20 460V190C20 92 92 20 180 20s160 72 160 170v270Z" />
        </clipPath>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--g-ink)" }} />
          <stop offset=".65" style={{ stopColor: "var(--g-cobalt)" }} />
          <stop offset="1" style={{ stopColor: "var(--g-terracotta)" }} />
        </linearGradient>
        <radialGradient id="orb">
          <stop offset="0" style={{ stopColor: "var(--g-orb)" }} />
          <stop offset=".35" style={{ stopColor: "var(--g-saffron-light)" }} stopOpacity=".9" />
          <stop offset="1" style={{ stopColor: "var(--g-saffron-light)" }} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath="url(#arch)">
        <rect width="360" height="460" fill="url(#night)" />
        {stars}
        <circle cx="180" cy="300" r="120" fill="url(#orb)" className="orb-breathe" />
        <path d="M0 360q90-40 180-10t180-20v130H0Z" style={{ fill: "var(--g-terracotta-deep)" }} />
        <path d="M0 395q120-30 220 0t140-10v75H0Z" style={{ fill: "var(--g-terracotta-night)" }} />
      </g>
      <path d="M20 460V190C20 92 92 20 180 20s160 72 160 170v270" fill="none" style={{ stroke: "var(--g-plaster)" }} strokeWidth="6" />
      <path d="M8 460V190C8 85 85 8 180 8s172 77 172 182v270" fill="none" style={{ stroke: "var(--g-saffron)" }} strokeWidth="3" />
    </svg>
  );
}

export function ProphetsBand() {
  return (
    <section className="prophets-band relative mt-16 md:mt-24 overflow-hidden" style={{ background: "var(--g-terracotta)", color: "var(--g-on)" }} aria-labelledby="prophets-band">
      <div className="zellige-lattice absolute inset-0 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 py-14 md:py-20 grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-14 items-center">
        <div>
          <h2 id="prophets-band" className="font-kufic font-bold text-4xl md:text-6xl leading-[1.15]">
            قصص الأنبياء
          </h2>
          <p className="mt-5 text-base md:text-lg leading-loose max-w-[34rem]" style={{ color: "var(--g-on-muted)" }}>
            خمسة وعشرون نبياً. كل قصة مأخوذة من الآيات ومن صحيحي البخاري ومسلم برقم الحديث، ومع كل قصة فيلم يمشي مع الآيات آية بآية. والأنبياء لا يُرسَمون، يظهرون نوراً فقط.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prophets/musa" className="btn btn-primary">
              <Play className="w-4 h-4" aria-hidden="true" />
              ابدأ بقصة موسى عليه السلام
            </Link>
            <Link
              href="/prophets"
              className="btn"
              style={{ background: "rgba(251,241,238,.08)", borderColor: "rgba(251,241,238,.5)", color: "var(--g-on)" }}
            >
              كل القصص
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[19rem] md:max-w-[22rem]">
          <ArchWindow />
        </div>
      </div>
      <div className="tile-strip" />
    </section>
  );
}
