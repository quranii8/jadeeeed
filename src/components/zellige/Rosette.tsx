/**
 * Botanical ornaments of the Rawdah: gold leaf, vine and the eight-petal flower.
 * Export names are kept from the previous world so every page picks up the new set.
 */
import type { CSSProperties } from "react";

/** a single leaf, base at (0,0), pointing up, length L */
export function leafPath(L: number, w = 0.42): string {
  const h = L * w;
  return `M0 0 C ${-h} ${-L * 0.3} ${-h * 0.7} ${-L * 0.78} 0 ${-L} C ${h * 0.7} ${-L * 0.78} ${h} ${-L * 0.3} 0 0 Z`;
}

/** The platform's mark: an eight-petal gold flower with a green heart, as woven into the Rawdah carpet. */
export function StarMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <circle r="47" fill="var(--g-cobalt)" />
      <circle r="42" fill="none" stroke="var(--g-saffron-light)" strokeWidth="1.4" opacity=".8" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={leafPath(34, 0.46)} transform={`rotate(${i * 45})`} fill="var(--g-saffron-light)" opacity={i % 2 ? 0.75 : 1} />
      ))}
      <circle r="9" fill="var(--g-cobalt)" stroke="var(--g-saffron-light)" strokeWidth="2" />
      <circle r="3.2" fill="var(--g-saffron-light)" />
    </svg>
  );
}

/** A gold sprig drawn in line, used large and quiet inside section arches. */
export function TileStar({ color, size = 64, className }: { color: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -60 100 110" className={className} aria-hidden="true" focusable="false">
      <g fill="none" style={{ stroke: color }} strokeWidth="1.6" strokeLinecap="round">
        <path d="M0 48 C 2 20 -4 -10 0 -52" />
        {[-34, -14, 6, 26].map((y, i) => (
          <g key={i}>
            <path d={leafPath(26)} transform={`translate(${i % 2 ? 1 : -1} ${y}) rotate(${i % 2 ? 48 : -48})`} />
            <path d={leafPath(22)} transform={`translate(0 ${y + 10}) rotate(${i % 2 ? -42 : 42})`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Small gold leaf pair that marks a section heading. */
export function HeadingStar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" className="shrink-0">
      <path d={leafPath(62, 0.45)} transform="translate(0 38) rotate(-32)" style={{ fill: "var(--gold)" }} />
      <path d={leafPath(50, 0.45)} transform="translate(0 38) rotate(30)" style={{ fill: "var(--gold-light)" }} opacity=".85" />
      <circle cx="0" cy="40" r="5" style={{ fill: "var(--gold)" }} />
    </svg>
  );
}

/**
 * A climbing vine: a gold stem that draws itself upward, leaves unfurling along it.
 * Height-agnostic: the viewBox is tall and narrow and the stem runs its full length.
 */
export function Vine({ className, flip = false, delay = 0, leaves = 11, style }: { className?: string; flip?: boolean; delay?: number; leaves?: number; style?: CSSProperties }) {
  const H = 1000;
  const stem = `M40 ${H} C 10 ${H * 0.86} 70 ${H * 0.72} 38 ${H * 0.58} S 12 ${H * 0.34} 44 ${H * 0.2} S 60 ${H * 0.05} 34 0`;
  const items = Array.from({ length: leaves }, (_, i) => {
    const t = (i + 0.6) / (leaves + 0.4);
    const y = H * (1 - t);
    const x = 40 + Math.sin(t * Math.PI * 3.1) * 22;
    const side = i % 2 ? 1 : -1;
    return { x, y, side, L: 46 - t * 16, d: delay + 500 + t * 1900 };
  });
  return (
    <svg viewBox={`0 0 80 ${H}`} preserveAspectRatio="xMidYMax meet" className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true" focusable="false">
      <path d={stem} fill="none" stroke="var(--g-saffron-light)" strokeWidth="2.2" strokeLinecap="round" className="vine-grow" style={{ ["--len" as string]: 1200, ["--d" as string]: `${delay}ms` } as CSSProperties} />
      {items.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.side * 58})`}>
          <g className="leaf-sway" style={{ ["--d" as string]: `${-i * 0.7}s` } as CSSProperties}>
            <path d={leafPath(l.L)} fill={i % 3 === 0 ? "var(--g-saffron-light)" : "var(--g-saffron)"} className="leaf-unfurl" style={{ ["--d" as string]: `${l.d}ms`, ["--o" as string]: "50% 100%" } as CSSProperties} />
            <path d={`M0 0 L0 ${-l.L * 0.8}`} stroke="var(--g-deep)" strokeOpacity=".35" strokeWidth="1" className="leaf-unfurl" style={{ ["--d" as string]: `${l.d}ms` } as CSSProperties} />
          </g>
        </g>
      ))}
      {[0.33, 0.7].map((t, i) => (
        <g key={`b${i}`} transform={`translate(${40 + Math.sin(t * Math.PI * 3.1) * 22} ${H * (1 - t)})`} className="leaf-unfurl" style={{ ["--d" as string]: `${delay + 900 + t * 1900}ms`, ["--o" as string]: "50% 50%" } as CSSProperties}>
          {Array.from({ length: 6 }, (_, k) => (
            <path key={k} d={leafPath(13, 0.6)} transform={`rotate(${k * 60})`} fill="#FBFCFA" opacity=".92" />
          ))}
          <circle r="3.4" fill="var(--g-saffron-light)" />
        </g>
      ))}
    </svg>
  );
}

/** A slender marble column with a gilded capital and base, drawn to any height. */
export function Column({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 1000" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="col-marble" x1="0" x2="1">
          <stop offset="0" stopColor="#E7EBE8" />
          <stop offset=".45" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D2D9D6" />
        </linearGradient>
      </defs>
      <rect x="14" y="70" width="32" height="870" fill="url(#col-marble)" />
      <path d="M2 70 h56 l-6 -18 h-44z M8 52 h44 l-4 -16 h-36z" fill="var(--g-saffron-light)" />
      <path d="M4 940 h52 v22 h-52z M0 962 h60 v38 h-60z" fill="var(--g-saffron)" />
      <path d="M14 70 v870" stroke="#BFC8C4" strokeWidth="1" />
    </svg>
  );
}

/** A wreath medallion of leaves, kept under the old name for any page that still uses it. */
export function Rosette({ className }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="-220 -220 440 440" className={className} aria-hidden="true" focusable="false">
      <circle r="200" fill="none" stroke="var(--g-saffron-light)" strokeOpacity=".35" strokeWidth="1.4" />
      {Array.from({ length: 36 }, (_, i) => (
        <path key={i} d={leafPath(42, 0.42)} transform={`rotate(${i * 10}) translate(0 -178) rotate(${i % 2 ? 30 : -30})`} fill="var(--g-saffron-light)" opacity={i % 2 ? 0.55 : 0.85} />
      ))}
    </svg>
  );
}
