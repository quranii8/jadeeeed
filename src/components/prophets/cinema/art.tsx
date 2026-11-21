/**
 * Atelier art kit for the Yunus film — hand-authored SVG, driven by frame.
 * No people are drawn: the prophet is represented only by a golden light.
 */
import React from "react";
import { interpolate, random } from "remotion";

export const W = 1080;
export const H = 1920;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function Defs() {
  return (
    <defs>
      <radialGradient id="orb">
        <stop offset="0" stopColor="#FFF8E1" />
        <stop offset="0.25" stopColor="#F6DC8E" />
        <stop offset="0.6" stopColor="#D9B15A" stopOpacity="0.55" />
        <stop offset="1" stopColor="#C8A951" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.7" />
      </radialGradient>
      <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141b38" />
        <stop offset="0.38" stopColor="#3a2a4f" />
        <stop offset="0.58" stopColor="#8a4f5a" />
        <stop offset="0.72" stopColor="#d58a55" />
        <stop offset="1" stopColor="#c58a5a" />
      </linearGradient>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05070f" />
        <stop offset="0.6" stopColor="#0d1630" />
        <stop offset="1" stopColor="#1a2448" />
      </linearGradient>
      <linearGradient id="storm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07090f" />
        <stop offset="1" stopColor="#1b2533" />
      </linearGradient>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#123a5a" />
        <stop offset="1" stopColor="#061626" />
      </linearGradient>
      <linearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0e4a66" />
        <stop offset="0.5" stopColor="#06263a" />
        <stop offset="1" stopColor="#01070d" />
      </linearGradient>
      <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b3b63" />
        <stop offset="0.35" stopColor="#8b6f86" />
        <stop offset="0.6" stopColor="#e7a873" />
        <stop offset="1" stopColor="#f2c48d" />
      </linearGradient>
      <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c99a62" />
        <stop offset="1" stopColor="#8e6440" />
      </linearGradient>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe6ff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#bfe6ff" stopOpacity="0" />
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="18" /></filter>
      <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
  );
}

/** Golden light with slow spiral rays — the only symbol for the prophet. */
export function Orb({ x, y, r = 40, f, rays = true, glow = 1 }: { x: number; y: number; r?: number; f: number; rays?: boolean; glow?: number }) {
  const pulse = 1 + 0.06 * Math.sin(f / 18);
  return (
    <g>
      <circle cx={x} cy={y} r={r * 5 * glow} fill="url(#orb)" opacity={0.35 * glow} />
      {rays &&
        Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2 + f / 220;
          const len = r * (2.4 + 0.9 * Math.sin(i * 1.7 + f / 30)) * glow;
          const x2 = x + Math.cos(a) * len;
          const y2 = y + Math.sin(a) * len;
          const cx = x + Math.cos(a + 0.35) * len * 0.55;
          const cy = y + Math.sin(a + 0.35) * len * 0.55;
          return (
            <g key={i}>
              <path d={`M ${x} ${y} Q ${cx} ${cy} ${x2} ${y2}`} stroke="#F3D27A" strokeWidth={2.2} fill="none" opacity={0.75} />
              <circle cx={x2} cy={y2} r={3} fill="#FFF3C9" opacity={0.85} />
            </g>
          );
        })}
      <circle cx={x} cy={y} r={r * pulse} fill="url(#orb)" />
      <circle cx={x} cy={y} r={r * 0.38} fill="#FFF8E1" opacity={0.9} />
      <circle cx={x} cy={y} r={r * 0.58} fill="none" stroke="#E9C46A" strokeWidth={2} opacity={0.8} />
    </g>
  );
}

export function Stars({ n, f, seed, maxY = 900 }: { n: number; f: number; seed: string; maxY?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`${seed}x${i}`) * W;
        const y = random(`${seed}y${i}`) * maxY;
        const s = random(`${seed}s${i}`) * 2.6 + 0.8;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (14 + random(`${seed}t${i}`) * 30) + i));
        return <circle key={i} cx={x} cy={y} r={s} fill="#fff6dd" opacity={tw} />;
      })}
    </g>
  );
}

export function Mountains({ y, colors }: { y: number; colors: string[] }) {
  const layers = [
    `M -50 ${y} L 120 ${y - 260} L 300 ${y - 120} L 470 ${y - 330} L 640 ${y - 150} L 820 ${y - 290} L 1130 ${y - 60} V ${y + 40} H -50 Z`,
    `M -50 ${y} L 200 ${y - 170} L 380 ${y - 40} L 560 ${y - 210} L 760 ${y - 60} L 950 ${y - 190} L 1130 ${y - 40} V ${y + 40} H -50 Z`,
  ];
  return (
    <g>
      {layers.map((d, i) => (
        <path key={i} d={d} fill={colors[i]} />
      ))}
    </g>
  );
}

/** Rolling sea surface made of stacked sine bands. */
export function Sea({ y, f, colors, amp = 18, speed = 1 }: { y: number; f: number; colors: string[]; amp?: number; speed?: number }) {
  return (
    <g>
      {colors.map((c, k) => {
        const yy = y + k * 70;
        const pts: string[] = [];
        for (let x = -40; x <= W + 40; x += 30) {
          const v = Math.sin(x / (120 + k * 30) + (f * speed) / (22 - k * 3) + k) * (amp - k * 3) + Math.sin(x / 47 + f / 13 + k) * 4;
          pts.push(`${x},${yy + v}`);
        }
        return <polygon key={k} points={`${pts.join(" ")} ${W + 40},${H} -40,${H}`} fill={c} />;
      })}
    </g>
  );
}

export function SandLines({ y0, f }: { y0: number; f: number }) {
  return (
    <g opacity={0.25}>
      {Array.from({ length: 14 }, (_, i) => {
        const y = y0 + i * 55;
        return (
          <path
            key={i}
            d={`M -20 ${y} q 140 ${-12 + (i % 3) * 6} 280 0 t 280 0 t 280 0 t 280 0`}
            stroke="#f6dcb0"
            strokeWidth={1.6}
            fill="none"
            transform={`translate(${Math.sin((f + i * 20) / 90) * 10} 0)`}
          />
        );
      })}
    </g>
  );
}

export function City({ y, f, lit = 0, color = "#1c1a33" }: { y: number; f: number; lit?: number; color?: string }) {
  const blocks = [
    [30, 140, 170], [170, 110, 260], [280, 150, 190], [420, 120, 320], [540, 160, 220], [690, 120, 280], [810, 150, 200], [950, 110, 250],
  ];
  return (
    <g>
      {blocks.map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y - h} width={w} height={h} fill={color} />
          {i % 3 === 1 && <path d={`M ${x + w / 2 - 38} ${y - h} a 38 38 0 0 1 76 0 Z`} fill={color} />}
          {i % 4 === 3 && <rect x={x + w / 2 - 9} y={y - h - 90} width="18" height="90" fill={color} />}
          {Array.from({ length: 6 }, (_, k) => {
            const on = interpolate(lit, [k / 6 + (i % 4) * 0.03, k / 6 + 0.12 + (i % 4) * 0.03], [0, 1], clamp);
            return (
              <rect
                key={k}
                x={x + 18 + (k % 3) * ((w - 40) / 3)}
                y={y - h + 40 + Math.floor(k / 3) * 60}
                width={18}
                height={28}
                rx={9}
                fill={on > 0.01 ? "#F3D27A" : "#2b2a4a"}
                opacity={0.3 + 0.7 * on}
              />
            );
          })}
        </g>
      ))}
      <rect x="0" y={y} width={W} height={H - y} fill={color} />
    </g>
  );
}

export function Ship({ x, y, f, tilt = 1 }: { x: number; y: number; f: number; tilt?: number }) {
  const rot = Math.sin(f / 24) * 3 * tilt;
  const bob = Math.sin(f / 19) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot})`}>
      <path d="M -260 0 H 260 L 200 110 H -200 Z" fill="#5b3a22" />
      <rect x="-250" y="-26" width="500" height="26" fill="#7a5131" />
      {[-210, -150, -90, -20, 50, 120, 180].map((dx, i) => (
        <rect key={dx} x={dx} y={-26 - 40 - (i % 2) * 18} width={50} height={40 + (i % 2) * 18} rx={6} fill={i % 2 ? "#9c7449" : "#a8814f"} />
      ))}
      <rect x="-6" y="-360" width="12" height="340" fill="#3f2715" />
      <path d="M 8 -350 Q 210 -230 8 -70 Z" fill="#e9dcc0" />
      <path d="M -8 -330 Q -150 -230 -8 -110 Z" fill="#d8c9a8" />
    </g>
  );
}

export function Whale({ x, y, s = 1, open = 0 }: { x: number; y: number; s?: number; open?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M -420 0 C -330 -190 40 -230 250 -120 C 330 -80 380 -40 420 -60 C 470 -150 540 -170 590 -170 C 560 -100 560 -10 600 60 C 540 50 480 30 430 0 C 360 110 140 170 -120 140 C -300 120 -400 70 -420 0 Z"
        fill="#16324a"
      />
      <path d="M -420 0 C -300 70 0 120 230 60" stroke="#2e5a7d" strokeWidth="8" fill="none" />
      <path d={`M -420 0 L -330 ${-20 - open * 60} L -300 0 Z`} fill="#0b1a28" />
      <circle cx="-300" cy="-60" r="12" fill="#cfe6f5" />
    </g>
  );
}

export function Bubbles({ f, n = 26, seed = "b" }: { f: number; n?: number; seed?: string }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`${seed}x${i}`) * W;
        const speed = 2 + random(`${seed}v${i}`) * 4;
        const y = H - ((f * speed + random(`${seed}y${i}`) * H) % (H + 100));
        const r = 4 + random(`${seed}r${i}`) * 10;
        return <circle key={i} cx={x + Math.sin((f + i * 10) / 20) * 8} cy={y} r={r} fill="none" stroke="#a9d8f2" strokeWidth={2} opacity={0.5} />;
      })}
    </g>
  );
}

export function LightRays({ f, opacity = 1 }: { f: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {[120, 330, 560, 760, 940].map((x, i) => (
        <polygon key={x} points={`${x - 40},0 ${x + 40},0 ${x + 160 + Math.sin(f / 40 + i) * 40},${H * 0.75} ${x - 60 + Math.sin(f / 40 + i) * 40},${H * 0.75}`} fill="url(#ray)" opacity={0.6 + 0.3 * Math.sin(f / 30 + i)} />
      ))}
    </g>
  );
}

export function Rain({ f, n = 90 }: { f: number; n?: number }) {
  return (
    <g opacity={0.5}>
      {Array.from({ length: n }, (_, i) => {
        const x = (random(`rx${i}`) * (W + 400) - 200 + f * 9) % (W + 200);
        const y = (random(`ry${i}`) * H + f * 46) % H;
        return <line key={i} x1={x} y1={y} x2={x - 22} y2={y + 70} stroke="#9fb6cc" strokeWidth={2} />;
      })}
    </g>
  );
}
