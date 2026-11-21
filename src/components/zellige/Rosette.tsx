/**
 * Eight-fold zellige rosette, built geometrically and set tile by tile.
 * Every tile is its own polygon so it can be "pressed into the wall" on load.
 */

type Pt = [number, number];
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number): Pt => [r * Math.sin(rad(deg)), -r * Math.cos(rad(deg))];
const pts = (list: Pt[]) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** 8-point star (two overlapping squares) around a centre */
function star(cx: number, cy: number, R: number, rot = 0): string {
  const inner = R * Math.cos(rad(45)) / Math.cos(rad(22.5));
  const list: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? R : inner;
    const [x, y] = polar(r, rot + i * 22.5);
    list.push([cx + x, cy + y]);
  }
  return pts(list);
}

/** a kite between two radii along an angle */
function kite(r0: number, r1: number, r2: number, deg: number, spread: number): string {
  return pts([polar(r0, deg), polar(r1, deg - spread), polar(r2, deg), polar(r1, deg + spread)]);
}

const COBALT = "#1B3A8C";
const COBALT_LIGHT = "#2D54B8";
const EMERALD = "#0E6B5A";
const SAFFRON = "#D99A1E";
const TERRACOTTA = "#B4472F";
const WHITE = "#EEF1EC";

type Tile = { points: string; fill: string; ring: number };

function buildTiles(): Tile[] {
  const t: Tile[] = [];
  // ring 0: the heart
  t.push({ points: star(0, 0, 74, 0), fill: SAFFRON, ring: 0 });
  t.push({ points: star(0, 0, 46, 22.5), fill: COBALT, ring: 0 });
  // ring 1: eight petals
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    t.push({ points: kite(70, 128, 176, a, 16), fill: i % 2 ? TERRACOTTA : EMERALD, ring: 1 });
  }
  // ring 2: small stars between the petals
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(150, i * 45 + 22.5);
    t.push({ points: star(x, y, 30, 22.5), fill: SAFFRON, ring: 2 });
    t.push({ points: star(x, y, 14, 0), fill: WHITE, ring: 2 });
  }
  // ring 3: sixteen white lozenges
  for (let i = 0; i < 16; i++) {
    t.push({ points: kite(186, 214, 246, i * 22.5, 5.5), fill: i % 2 ? WHITE : COBALT_LIGHT, ring: 3 });
  }
  // ring 4: eight large stars on the axes
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(300, i * 45);
    t.push({ points: star(x, y, 58, 0), fill: i % 2 ? EMERALD : TERRACOTTA, ring: 4 });
    t.push({ points: star(x, y, 34, 22.5), fill: WHITE, ring: 4 });
    t.push({ points: star(x, y, 16, 0), fill: SAFFRON, ring: 4 });
  }
  // ring 5: kites reaching out between the large stars
  for (let i = 0; i < 8; i++) {
    const a = i * 45 + 22.5;
    t.push({ points: kite(250, 320, 392, a, 7), fill: SAFFRON, ring: 5 });
  }
  // ring 6: outer lozenge crown
  for (let i = 0; i < 32; i++) {
    t.push({ points: kite(392, 410, 432, i * 11.25, 2.6), fill: i % 2 ? EMERALD : WHITE, ring: 6 });
  }
  return t;
}

const TILES = buildTiles();

export function Rosette({ className, animate = true }: { className?: string; animate?: boolean }) {
  let n = 0;
  return (
    <svg viewBox="-440 -440 880 880" className={className} aria-hidden="true" focusable="false">
      <g className={animate ? "rosette-turn" : undefined}>
        <circle r={436} fill="none" stroke="var(--grout)" strokeWidth={2} opacity={0.35} />
        {TILES.map((tile, i) => {
          const d = tile.ring * 140 + (n++ % 32) * 14;
          return (
            <polygon
              key={i}
              points={tile.points}
              fill={tile.fill}
              stroke="var(--grout)"
              strokeWidth={3}
              strokeLinejoin="round"
              className={animate ? "tile-set" : undefined}
              style={animate ? ({ ["--d" as string]: `${d}ms` } as React.CSSProperties) : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** The platform's mark: a saffron eight-point star with a cobalt heart. */
export function StarMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <polygon points={star(0, 0, 47, 0)} fill={SAFFRON} stroke="#EEF1EC" strokeWidth={4} strokeLinejoin="round" />
      <polygon points={star(0, 0, 29, 22.5)} fill={COBALT} stroke="#EEF1EC" strokeWidth={3.5} strokeLinejoin="round" />
      <polygon points={star(0, 0, 11, 0)} fill="#EEF1EC" />
    </svg>
  );
}

/** A single glazed star used inside tiles. */
export function TileStar({ color, size = 64, className }: { color: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} aria-hidden="true" focusable="false">
      <polygon points={star(0, 0, 47, 0)} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={star(0, 0, 30, 22.5)} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/** Small saffron star that marks a section heading. */
export function HeadingStar({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" className="shrink-0">
      <polygon points={star(0, 0, 46, 0)} fill="var(--gold)" />
      <polygon points={star(0, 0, 20, 22.5)} fill="var(--bg)" />
    </svg>
  );
}
