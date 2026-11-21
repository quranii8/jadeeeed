/**
 * Declarative scene kit. A film shot is a list of layers drawn back-to-front.
 * Every layer is hand-authored SVG driven by the frame; no people are ever drawn.
 * Timing fields (`at`) are fractions of the shot duration: [start, end].
 */
import React from "react";
import { interpolate, random, Easing } from "remotion";
import { Bubbles, City, LightRays, Mountains, Orb, Rain, SandLines, Sea, Ship, Stars, W, H, Whale, clamp } from "./art";

export type Layer = { type: string; [k: string]: any };
type Ctx = { f: number; d: number };

const ease = Easing.bezier(0.33, 0, 0.2, 1);
/** progress 0..1 between two fractions of the shot */
const prog = (c: Ctx, at?: [number, number]) =>
  at ? interpolate(c.f / c.d, at, [0, 1], { ...clamp, easing: ease }) : 1;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SKIES: Record<string, string[]> = {
  dusk: ["#141b38", "#3a2a4f", "#8a4f5a", "#d58a55"],
  night: ["#05070f", "#0d1630", "#1a2448"],
  storm: ["#05070c", "#121a26", "#1b2533"],
  dawn: ["#2b3b63", "#8b6f86", "#e7a873", "#f2c48d"],
  day: ["#5d93c4", "#9cc6e4", "#e9d9b4"],
  desert: ["#3b2f4d", "#a2604f", "#e3a061", "#f0c088"],
  dark: ["#010204", "#05070c"],
  deep: ["#0e4a66", "#06263a", "#01070d"],
  egypt: ["#2d3a5c", "#c27a54", "#f0b472", "#f7d39a"],
  fire: ["#140707", "#3b0e09", "#7a2610"],
};

function Sky({ preset = "night", id }: { preset?: string; id: string }) {
  const stops = SKIES[preset] ?? SKIES.night;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

function Crescent({ x, y, r = 70, color = "#f4e2b0" }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.2} fill={color} opacity={0.08} />
      <path d={`M ${x} ${y - r} a ${r} ${r} 0 1 0 ${r * 0.72} ${r * 1.7} a ${r * 0.8} ${r * 0.8} 0 1 1 ${-r * 0.72} ${-r * 1.7} Z`} fill={color} />
    </g>
  );
}

function Disc({ x, y, r, color, glow = 0.5 }: { x: number; y: number; r: number; color: string; glow?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.6} fill={color} opacity={glow * 0.18} />
      <circle cx={x} cy={y} r={r * 1.5} fill={color} opacity={glow * 0.25} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
}

/** Four-point star (a bright "kawkab") */
function BrightStar({ x, y, r = 30, o = 1 }: { x: number; y: number; r?: number; o?: number }) {
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r * 2.5} fill="#fff4d0" opacity={0.15} />
      <path d={`M ${x} ${y - r * 2} Q ${x + r * 0.25} ${y - r * 0.25} ${x + r * 2} ${y} Q ${x + r * 0.25} ${y + r * 0.25} ${x} ${y + r * 2} Q ${x - r * 0.25} ${y + r * 0.25} ${x - r * 2} ${y} Q ${x - r * 0.25} ${y - r * 0.25} ${x} ${y - r * 2} Z`} fill="#fff4d0" />
    </g>
  );
}

function Dunes({ y, colors = ["#b77d4b", "#9b6538", "#7f5230"] }: { y: number; colors?: string[] }) {
  return (
    <g>
      {colors.map((c, k) => {
        const yy = y + k * 120;
        return <path key={k} d={`M -50 ${yy + 60} C 200 ${yy - 40} 380 ${yy + 80} 560 ${yy + 20} S 900 ${yy - 30} 1130 ${yy + 50} V ${H} H -50 Z`} fill={c} />;
      })}
    </g>
  );
}

function Clouds({ c, n = 5, dark = true, y = 260 }: { c: Ctx; n?: number; dark?: boolean; y?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = ((random(`cl${i}`) * W + c.f * (0.6 + i * 0.2)) % (W + 400)) - 200;
        const yy = y + random(`cy${i}`) * 400;
        const s = 0.8 + random(`cs${i}`) * 0.9;
        const col = dark ? (i % 2 ? "#151d2b" : "#1d2738") : i % 2 ? "#e9d8c0" : "#f4e7d2";
        return (
          <g key={i} transform={`translate(${x} ${yy}) scale(${s})`} opacity={dark ? 0.95 : 0.7}>
            <ellipse cx={0} cy={0} rx={190} ry={60} fill={col} />
            <ellipse cx={-80} cy={-30} rx={110} ry={70} fill={col} />
            <ellipse cx={70} cy={-40} rx={120} ry={80} fill={col} />
          </g>
        );
      })}
    </g>
  );
}

function Lightning({ c, x = 700 }: { c: Ctx; x?: number }) {
  const on = c.f % 75 < 4;
  if (!on) return null;
  return (
    <g>
      <rect width={W} height={H} fill="#e7eeff" opacity={0.28} />
      <path d={`M ${x} 300 L ${x - 60} 520 L ${x + 10} 520 L ${x - 70} 780`} stroke="#f2f6ff" strokeWidth={8} fill="none" />
    </g>
  );
}

/** Water gushing up from the ground ("we caused the earth to burst with springs") */
function Springs({ c, xs = [180, 420, 680, 900], y = 1500, at }: { c: Ctx; xs?: number[]; y?: number; at?: [number, number] }) {
  const p = prog(c, at);
  return (
    <g>
      {xs.map((x, i) => {
        const h = p * (220 + (i % 3) * 80) * (1 + 0.08 * Math.sin(c.f / 5 + i));
        return (
          <g key={x}>
            <path d={`M ${x - 26} ${y} Q ${x} ${y - h * 1.1} ${x + 26} ${y} Z`} fill="#6fb3dd" opacity={0.85} />
            {Array.from({ length: 6 }, (_, k) => (
              <circle key={k} cx={x + Math.sin(c.f / 4 + k * 2) * 40} cy={y - h + ((c.f * 6 + k * 30) % 160)} r={6} fill="#bfe3f7" opacity={p * 0.8} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

function Flames({ c, x = 540, y = 1500, w = 760, h = 520, cool }: { c: Ctx; x?: number; y?: number; w?: number; h?: number; cool?: [number, number] }) {
  const k = cool ? prog(c, cool) : 0;
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => {
        const fx = x - w / 2 + (i / 12) * w;
        const fh = h * (0.55 + 0.45 * random(`fl${i}`)) * (1 + 0.12 * Math.sin(c.f / 3 + i * 1.7)) * (1 - k * 0.95);
        const col = i % 3 === 0 ? "#ffcf5a" : i % 3 === 1 ? "#ff8a2a" : "#e0461b";
        return <path key={i} d={`M ${fx - 60} ${y} Q ${fx - 10} ${y - fh * 0.6} ${fx + Math.sin(c.f / 6 + i) * 20} ${y - fh} Q ${fx + 20} ${y - fh * 0.5} ${fx + 60} ${y} Z`} fill={col} opacity={0.9 * (1 - k)} />;
      })}
      <ellipse cx={x} cy={y + 10} rx={w / 2 + 80} ry={60} fill="#3a1408" opacity={1 - k} />
      {k > 0 && <Garden c={c} x={x} y={y} w={w} grow={k} />}
    </g>
  );
}

/** Green garden that grows (cool and peace) */
function Garden({ c, x = 540, y = 1500, w = 760, grow = 1 }: { c: Ctx; x?: number; y?: number; w?: number; grow?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 20} rx={(w / 2 + 80) * grow} ry={70 * grow} fill="#2f5d34" />
      {Array.from({ length: 11 }, (_, i) => {
        const gx = x - w / 2 + (i / 10) * w;
        const s = interpolate(grow, [i / 14, i / 14 + 0.4], [0, 1], clamp);
        return (
          <g key={i} transform={`translate(${gx} ${y}) scale(${s})`}>
            <path d="M 0 0 C -50 -80 -10 -170 0 -200 C 10 -170 50 -80 0 0 Z" fill={i % 2 ? "#5fa45a" : "#4c8a46"} />
            <circle cx={i % 2 ? 22 : -22} cy={-120} r={10} fill="#f6e3a1" opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
}

function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -10 0 Q 10 -200 30 -360" stroke="#3d2a1c" strokeWidth={22} fill="none" />
      {[-60, -20, 20, 60, 100, 150].map((a) => (
        <path key={a} d={`M 30 -360 q ${Math.cos((a * Math.PI) / 180) * 120} ${-40 + Math.sin((a * Math.PI) / 180) * 60} ${Math.cos((a * Math.PI) / 180) * 220} ${Math.sin((a * Math.PI) / 180) * 140}`} stroke="#2f4d2a" strokeWidth={16} fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** Simple bird silhouettes flying from one point to another */
function Birds({ c, n = 4, from = [100, 600], to = [540, 1200], at = [0.1, 0.8] as [number, number], spread = 160 }: { c: Ctx; n?: number; from?: number[]; to?: number[]; at?: [number, number]; spread?: number }) {
  const p = prog(c, at);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2;
        const fx = from[0] + Math.cos(ang) * spread * 2;
        const fy = from[1] + Math.sin(ang) * spread;
        const x = lerp(fx, to[0] + Math.cos(ang) * 60, p);
        const y = lerp(fy, to[1] + Math.sin(ang) * 40, p);
        const flap = Math.sin(c.f / 3 + i) * 22;
        return <path key={i} d={`M ${x - 50} ${y + flap} Q ${x - 22} ${y - 18} ${x} ${y} Q ${x + 22} ${y - 18} ${x + 50} ${y + flap}`} stroke="#1c1a2e" strokeWidth={9} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
}

/** Plain stone pillars (no figures). `fall` topples all but the largest. */
function Pillars({ c, y = 1450, fall }: { c: Ctx; y?: number; fall?: [number, number] }) {
  const p = fall ? prog(c, fall) : 0;
  const xs = [170, 330, 480, 640, 800, 930];
  return (
    <g>
      {xs.map((x, i) => {
        const big = i === 3;
        const h = big ? 560 : 300 + (i % 2) * 80;
        const rot = big ? 0 : p * (i < 3 ? -78 : 78);
        return (
          <g key={x} transform={`rotate(${rot} ${x} ${y})`}>
            <rect x={x - (big ? 60 : 38)} y={y - h} width={big ? 120 : 76} height={h} rx={10} fill={big ? "#6b5a4b" : "#5c4e43"} />
            <rect x={x - (big ? 75 : 48)} y={y - h - 26} width={big ? 150 : 96} height={26} rx={6} fill="#7a6857" />
          </g>
        );
      })}
      <rect x={0} y={y} width={W} height={H - y} fill="#2c241f" />
    </g>
  );
}

/** The Kaaba with courses rising */
function Kaaba({ c, x = 540, y = 1480, build }: { c: Ctx; x?: number; y?: number; build?: [number, number] }) {
  const p = build ? prog(c, build) : 1;
  const rows = 9;
  const shown = Math.ceil(p * rows);
  return (
    <g>
      {Array.from({ length: shown }, (_, r) => (
        <g key={r}>
          {Array.from({ length: 6 }, (_, k) => (
            <rect key={k} x={x - 300 + k * 100 + (r % 2) * 20} y={y - (r + 1) * 52} width={96} height={48} rx={4} fill={r % 2 ? "#6d5a45" : "#7b6650"} />
          ))}
        </g>
      ))}
      {p >= 1 && <rect x={x - 300} y={y - rows * 52 + 40} width={620} height={28} fill="#C8A951" opacity={0.85} />}
    </g>
  );
}

function Ram({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={0} rx={150} ry={90} fill="#efe6d4" />
      {[-110, -60, -10, 40, 90].map((dx) => (
        <circle key={dx} cx={dx} cy={-60} r={40} fill="#f7f0e2" />
      ))}
      <ellipse cx={170} cy={-30} rx={55} ry={42} fill="#d8cdb8" />
      <path d="M 150 -60 c -40 -40 -10 -80 30 -60 c 30 15 20 50 -5 55" stroke="#8a7155" strokeWidth={14} fill="none" />
      {[-90, -40, 50, 100].map((dx) => (
        <rect key={dx} x={dx - 9} y={70} width={18} height={80} fill="#5b4a3a" />
      ))}
    </g>
  );
}

/** A basket/chest floating down a river */
function Chest({ c, from = 150, to = 850, y = 1520, at = [0, 1] as [number, number] }: { c: Ctx; from?: number; to?: number; y?: number; at?: [number, number] }) {
  const x = lerp(from, to, prog(c, at));
  const bob = Math.sin(c.f / 12) * 8;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${Math.sin(c.f / 15) * 4})`}>
      <rect x={-90} y={-60} width={180} height={70} rx={14} fill="#8a6a3d" />
      <path d="M -90 -60 Q 0 -110 90 -60" fill="#a07e4c" />
      {[-55, 0, 55].map((dx) => (
        <line key={dx} x1={dx} y1={-70} x2={dx} y2={10} stroke="#6b4f2b" strokeWidth={6} />
      ))}
    </g>
  );
}

function Reeds({ y = 1480 }: { y?: number }) {
  return (
    <g>
      {Array.from({ length: 26 }, (_, i) => {
        const x = (i * 43) % W;
        const h = 120 + ((i * 37) % 90);
        return <path key={i} d={`M ${x} ${y + 40} q 10 ${-h / 2} ${i % 2 ? 18 : -18} ${-h}`} stroke="#3e5a34" strokeWidth={7} fill="none" />;
      })}
    </g>
  );
}

function Pyramids({ y = 1360 }: { y?: number }) {
  return (
    <g>
      <path d={`M 120 ${y} L 330 ${y - 260} L 540 ${y} Z`} fill="#b98a5a" />
      <path d={`M 330 ${y - 260} L 540 ${y} L 420 ${y} Z`} fill="#9c7046" />
      <path d={`M 520 ${y} L 760 ${y - 330} L 1000 ${y} Z`} fill="#c59563" />
      <path d={`M 760 ${y - 330} L 1000 ${y} L 860 ${y} Z`} fill="#a77a4c" />
    </g>
  );
}

/** A well seen from inside, looking up at the opening */
function WellInside({ c, light = 0.6 }: { c: Ctx; light?: number }) {
  return (
    <g>
      <rect width={W} height={H} fill="#0d0a08" />
      <ellipse cx={540} cy={420} rx={300} ry={110} fill="#d9e8f2" opacity={0.85 * light} />
      <ellipse cx={540} cy={420} rx={300} ry={110} fill="none" stroke="#3a2c22" strokeWidth={30} />
      <polygon points={`240,420 840,420 1080,${H} 0,${H}`} fill="#bfdcef" opacity={0.08 * light} />
      {Array.from({ length: 12 }, (_, r) => (
        <g key={r}>
          {Array.from({ length: 8 }, (_, k) => (
            <rect key={k} x={-40 + k * 150 + (r % 2) * 70} y={560 + r * 120} width={140} height={110} rx={8} fill={r % 2 ? "#2a2018" : "#241b14"} />
          ))}
        </g>
      ))}
      <ellipse cx={540} cy={1800} rx={420} ry={80} fill="#1b2a33" opacity={0.9} />
    </g>
  );
}

function Bucket({ c, x = 560, at = [0.1, 0.7] as [number, number] }: { c: Ctx; x?: number; at?: [number, number] }) {
  const y = lerp(380, 1300, prog(c, at));
  return (
    <g>
      <line x1={x} y1={300} x2={x} y2={y - 60} stroke="#c9a77a" strokeWidth={5} />
      <path d={`M ${x - 60} ${y - 60} L ${x + 60} ${y - 60} L ${x + 46} ${y + 50} L ${x - 46} ${y + 50} Z`} fill="#7a5a3a" />
      <path d={`M ${x - 60} ${y - 60} Q ${x} ${y - 130} ${x + 60} ${y - 60}`} stroke="#c9a77a" strokeWidth={5} fill="none" />
    </g>
  );
}

/** Prison window with bars and a beam of light */
function PrisonWindow({ c }: { c: Ctx }) {
  return (
    <g>
      <rect width={W} height={H} fill="#16120f" />
      <polygon points={`420,1260 660,1260 980,1900 120,1900`} fill="#f2d79b" opacity={0.08 + 0.03 * Math.sin(c.f / 30)} />
      <rect x={420} y={1000} width={240} height={260} rx={10} fill="#f0d8a4" opacity={0.75} />
      {[460, 510, 560, 610].map((x) => (
        <rect key={x} x={x} y={1000} width={14} height={260} fill="#2a221c" />
      ))}
      {Array.from({ length: 10 }, (_, r) => (
        <rect key={r} x={0} y={700 + r * 110} width={W} height={4} fill="#221b16" />
      ))}
    </g>
  );
}

function Cow({ x, y, lean = false, s = 1, o = 1 }: { x: number; y: number; lean?: boolean; s?: number; o?: number }) {
  const ry = lean ? 34 : 62;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={0} rx={lean ? 95 : 110} ry={ry} fill={lean ? "#6e5a48" : "#c9a37a"} />
      <ellipse cx={-110} cy={-25} rx={34} ry={26} fill={lean ? "#5e4c3c" : "#b78f66"} />
      <path d="M -130 -45 q -12 -24 4 -30 M -96 -45 q 10 -24 -4 -30" stroke="#e8e0cf" strokeWidth={6} fill="none" />
      {[-60, -25, 30, 65].map((dx) => (
        <rect key={dx} x={dx - 7} y={ry - 10} width={14} height={lean ? 90 : 70} fill={lean ? "#4d3e31" : "#8a6c4c"} />
      ))}
    </g>
  );
}

function Ears({ c, green = true, x0 = 140, y = 1500, n = 7, grow }: { c: Ctx; green?: boolean; x0?: number; y?: number; n?: number; grow?: [number, number] }) {
  const g = grow ? prog(c, grow) : 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 120;
        const sway = Math.sin(c.f / 25 + i) * (green ? 8 : 3);
        const col = green ? "#5e9c48" : "#b39858";
        const h = 380 * g;
        return (
          <g key={i}>
            <path d={`M ${x} ${y} Q ${x + sway} ${y - h / 2} ${x + sway * 2} ${y - h}`} stroke={col} strokeWidth={8} fill="none" />
            {g > 0.7 &&
              Array.from({ length: 6 }, (_, k) => (
                <ellipse key={k} cx={x + sway * 2 + (k % 2 ? 14 : -14)} cy={y - h + 20 + k * 22} rx={14} ry={22} fill={col} transform={`rotate(${k % 2 ? 25 : -25} ${x + sway * 2} ${y - h + 20 + k * 22})`} />
              ))}
          </g>
        );
      })}
    </g>
  );
}

function Granaries({ y = 1500, fill }: { y?: number; fill?: number }) {
  return (
    <g>
      {[180, 420, 660, 900].map((x, i) => (
        <g key={x}>
          <rect x={x - 90} y={y - 300} width={180} height={300} fill="#c8a47a" />
          <path d={`M ${x - 90} ${y - 300} Q ${x} ${y - 470} ${x + 90} ${y - 300} Z`} fill="#b48f63" />
          <rect x={x - 30} y={y - 110} width={60} height={110} rx={30} fill="#5b4430" />
          {fill !== undefined && <rect x={x - 70} y={y - 280 + 200 * (1 - fill)} width={140} height={200 * fill} fill="#e8c86a" opacity={0.35} />}
        </g>
      ))}
      <rect x={0} y={y} width={W} height={H - y} fill="#a07a50" />
    </g>
  );
}

function Shirt({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -60 -150 L -160 -100 L -200 0 L -130 20 L -110 -40 L -110 200 L 110 200 L 110 -40 L 130 20 L 200 0 L 160 -100 L 60 -150 Q 0 -110 -60 -150 Z" fill="#efe4cc" />
      <path d="M -60 -150 Q 0 -100 60 -150" stroke="#c8b796" strokeWidth={6} fill="none" />
    </g>
  );
}

/** Eye of light opening (sight restored) */
function EyeLight({ c, at = [0.2, 0.8] as [number, number] }: { c: Ctx; at?: [number, number] }) {
  const p = prog(c, at);
  return (
    <g>
      <circle cx={540} cy={1200} r={80 + p * 700} fill="url(#orb)" opacity={0.2 + p * 0.3} />
      <path d={`M 240 1200 Q 540 ${1200 - 220 * p} 840 1200 Q 540 ${1200 + 220 * p} 240 1200 Z`} fill="#f7ecd0" opacity={0.25 + p * 0.6} stroke="#D9B65E" strokeWidth={5} />
      <circle cx={540} cy={1200} r={90 * p} fill="#2a4a6a" />
      <circle cx={540} cy={1200} r={40 * p} fill="#0b1520" />
    </g>
  );
}

/** Eleven stars, the sun and the moon, descending into prostration around a point */
function Prostration({ c, at = [0.1, 0.8] as [number, number], cx = 540, cy = 1250 }: { c: Ctx; at?: [number, number]; cx?: number; cy?: number }) {
  const p = prog(c, at);
  const items = [...Array.from({ length: 11 }, (_, i) => ({ kind: "star", i })), { kind: "sun", i: 11 }, { kind: "moon", i: 12 }];
  return (
    <g>
      {items.map(({ kind, i }) => {
        const ang = Math.PI + (i / 12) * Math.PI;
        const R0 = 560, R1 = 300;
        const r = lerp(R0, R1, p);
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r * 0.75 + p * 120;
        if (kind === "sun") return <Disc key={i} x={x} y={y} r={46} color="#ffd27a" />;
        if (kind === "moon") return <Crescent key={i} x={x} y={y} r={40} />;
        return <BrightStar key={i} x={x} y={y} r={14} o={0.9} />;
      })}
    </g>
  );
}

function Throne({ x = 540, y = 1500 }: { x?: number; y?: number }) {
  return (
    <g>
      <rect x={x - 260} y={y - 60} width={520} height={60} fill="#6d5340" />
      <rect x={x - 200} y={y - 300} width={400} height={240} rx={20} fill="#7d6049" />
      <rect x={x - 160} y={y - 420} width={320} height={140} rx={60} fill="#8a6b51" />
      <rect x={x - 200} y={y - 300} width={400} height={20} fill="#C8A951" />
      <rect x={0} y={y} width={W} height={H - y} fill="#3d2f25" />
    </g>
  );
}

/** Staff that becomes a serpent */
function Staff({ c, x = 540, y = 1450, turn }: { c: Ctx; x?: number; y?: number; turn?: [number, number] }) {
  const p = turn ? prog(c, turn) : 0;
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const tx = x - 300 + i * 20;
    const wave = Math.sin(i / 2.4 + c.f / 5) * 50 * p;
    pts.push(`${tx},${y + wave}`);
  }
  return (
    <g>
      <polyline points={pts.join(" ")} fill="none" stroke={p > 0.5 ? "#4f6b3a" : "#6b4a2a"} strokeWidth={p > 0.5 ? 30 : 18} strokeLinecap="round" strokeLinejoin="round" />
      {p > 0.5 && <ellipse cx={x + 310} cy={y + Math.sin(30 / 2.4 + c.f / 5) * 50 * p} rx={40} ry={26} fill="#4f6b3a" />}
    </g>
  );
}

/** Ropes that wriggle and are then swallowed */
function Ropes({ c, y = 1500, vanish }: { c: Ctx; y?: number; vanish?: [number, number] }) {
  const v = vanish ? prog(c, vanish) : 0;
  return (
    <g opacity={1 - v}>
      {Array.from({ length: 9 }, (_, i) => {
        const x0 = 90 + i * 110;
        const d = Array.from({ length: 8 }, (_, k) => `${x0 + Math.sin(k + c.f / 6 + i) * 30},${y - k * 30}`).join(" ");
        return <polyline key={i} points={d} fill="none" stroke="#9c8156" strokeWidth={12} strokeLinecap="round" />;
      })}
    </g>
  );
}

/** The sea parting into two walls with a dry path */
function SeaSplit({ c, at = [0.1, 0.6] as [number, number], close }: { c: Ctx; at?: [number, number]; close?: [number, number] }) {
  const open = prog(c, at) * (1 - (close ? prog(c, close) : 0));
  const gap = open * 280;
  const wall = (side: number) => {
    const x0 = 540 + side * gap;
    const xs = side < 0 ? [-40, x0] : [x0, W + 40];
    return (
      <g>
        <rect x={xs[0]} y={760} width={xs[1] - xs[0]} height={H - 760} fill="#0f3b5c" />
        <path d={`M ${x0} 760 ${Array.from({ length: 24 }, (_, k) => `L ${x0 + side * Math.sin(k + c.f / 6) * 18} ${760 + k * 50}`).join(" ")} L ${x0} ${H}`} stroke="#bfe3f7" strokeWidth={8} fill="none" opacity={0.6} />
      </g>
    );
  };
  return (
    <g>
      <rect x={0} y={760} width={W} height={H - 760} fill="#c9a777" />
      <path d={`M ${540 - gap} ${H} L 540 900 L ${540 + gap} ${H} Z`} fill="#d8b98a" opacity={open} />
      {wall(-1)}
      {wall(1)}
    </g>
  );
}

/** Mountain that crumbles to dust */
function Crumble({ c, at = [0.3, 0.7] as [number, number] }: { c: Ctx; at?: [number, number] }) {
  const p = prog(c, at);
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => {
        const bx = 250 + (i % 6) * 100;
        const by = 1500 - Math.floor(i / 6) * 120;
        const dx = (random(`cr${i}`) - 0.5) * 500 * p;
        const dy = p * (300 + random(`cy${i}`) * 300);
        return <polygon key={i} points={`${bx},${by} ${bx + 100},${by} ${bx + 50},${by - 130}`} transform={`translate(${dx} ${dy}) rotate(${p * 90 * (i % 2 ? 1 : -1)} ${bx + 50} ${by})`} fill={i % 2 ? "#6a5a6e" : "#5a4c60"} opacity={1 - p * 0.6} />;
      })}
      <circle cx={540} cy={1500} r={p * 600} fill="#d8c8b0" opacity={p * 0.25} />
    </g>
  );
}

function Tablets({ c, appear = [0.2, 0.6] as [number, number] }: { c: Ctx; appear?: [number, number] }) {
  const p = prog(c, appear);
  return (
    <g opacity={p} transform={`translate(0 ${(1 - p) * 60})`}>
      <circle cx={540} cy={1200} r={420} fill="url(#orb)" opacity={0.35} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={`M ${540 + s * 30} 1450 V 1050 a 120 120 0 0 ${s > 0 ? 1 : 0} ${s * 240} 0 V 1450 Z`} fill="#c9bba0" stroke="#8c7d64" strokeWidth={6} />
          {Array.from({ length: 6 }, (_, k) => (
            <line key={k} x1={540 + s * 70} y1={1100 + k * 55} x2={540 + s * 230} y2={1100 + k * 55} stroke="#8c7d64" strokeWidth={6} opacity={0.7} />
          ))}
        </g>
      ))}
    </g>
  );
}

function Rainbowless() {
  return null;
}

/** A lone bush/tree on a mountainside with fire (the burning tree at Tur) */
function FireTree({ c, x = 700, y = 1300 }: { c: Ctx; x?: number; y?: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 120} r={240} fill="#ffb347" opacity={0.18 + 0.05 * Math.sin(c.f / 8)} />
      <path d={`M ${x} ${y} L ${x} ${y - 140}`} stroke="#3b2a1c" strokeWidth={16} />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M ${x - 80 + i * 26} ${y - 120} q 10 ${-60 - (i % 3) * 30} ${Math.sin(c.f / 4 + i) * 14} ${-120 - (i % 3) * 40}`} stroke={i % 2 ? "#ffcf5a" : "#ff8a2a"} strokeWidth={20} fill="none" strokeLinecap="round" opacity={0.9} />
      ))}
    </g>
  );
}

export function renderLayer(l: Layer, c: Ctx, i: number): React.ReactNode {
  const k = `${l.type}${i}`;
  switch (l.type) {
    case "sky":
      return <Sky key={k} preset={l.preset} id={`sky${i}`} />;
    case "stars":
      return <Stars key={k} n={l.n ?? 60} f={c.f} seed={l.seed ?? k} maxY={l.maxY ?? 900} />;
    case "moon": {
      const p = prog(c, l.at);
      return <Crescent key={k} x={l.x ?? 800} y={lerp(l.y0 ?? l.y ?? 600, l.y1 ?? l.y ?? 600, p)} r={l.r ?? 70} />;
    }
    case "sun": {
      const p = prog(c, l.at);
      return <Disc key={k} x={l.x ?? 540} y={lerp(l.y0 ?? l.y ?? 1100, l.y1 ?? l.y ?? 1100, p)} r={l.r ?? 110} color={l.color ?? "#ffd27a"} glow={l.glow ?? 0.8} />;
    }
    case "kawkab": {
      const p = prog(c, l.at);
      return <BrightStar key={k} x={l.x ?? 540} y={lerp(l.y0 ?? l.y ?? 800, l.y1 ?? l.y ?? 800, p)} r={l.r ?? 30} o={l.fade ? 1 - prog(c, l.fade) : 1} />;
    }
    case "mountains":
      return <Mountains key={k} y={l.y ?? 1300} colors={l.colors ?? ["#3e2f4f", "#2f2440"]} />;
    case "dunes":
      return <Dunes key={k} y={l.y ?? 1350} colors={l.colors} />;
    case "sand":
      return <SandLines key={k} y0={l.y ?? 1500} f={c.f} />;
    case "sea": {
      const p = prog(c, l.at);
      return <Sea key={k} y={lerp(l.y0 ?? l.y ?? 1400, l.y1 ?? l.y ?? 1400, p)} f={c.f} colors={l.colors ?? ["#123a5d", "#0d2c48", "#0a2036"]} amp={l.amp ?? 16} speed={l.speed ?? 1} />;
    }
    case "city":
      return <City key={k} y={l.y ?? 1450} f={c.f} lit={l.lit ? prog(c, l.lit) : 0} color={l.color ?? "#1d1a35"} />;
    case "ship": {
      const p = prog(c, l.at);
      return (
        <g key={k} transform={`scale(${l.scale ?? 1})`} style={{ transformOrigin: "540px 1300px" }}>
          <Ship x={lerp(l.x0 ?? l.x ?? 540, l.x1 ?? l.x ?? 540, p)} y={lerp(l.y0 ?? l.y ?? 1330, l.y1 ?? l.y ?? 1330, p)} f={c.f} tilt={l.tilt ?? 1} />
        </g>
      );
    }
    case "rain":
      return <Rain key={k} f={c.f} n={l.n ?? 90} />;
    case "clouds":
      return <Clouds key={k} c={c} n={l.n} dark={l.dark ?? true} y={l.y} />;
    case "lightning":
      return <Lightning key={k} c={c} x={l.x} />;
    case "springs":
      return <Springs key={k} c={c} xs={l.xs} y={l.y} at={l.at} />;
    case "flames":
      return <Flames key={k} c={c} x={l.x} y={l.y} w={l.w} h={l.h} cool={l.cool} />;
    case "garden":
      return <Garden key={k} c={c} x={l.x} y={l.y} w={l.w} grow={l.at ? prog(c, l.at) : 1} />;
    case "palm":
      return <Palm key={k} x={l.x} y={l.y} s={l.s} />;
    case "birds":
      return <Birds key={k} c={c} n={l.n} from={l.from} to={l.to} at={l.at} spread={l.spread} />;
    case "pillars":
      return <Pillars key={k} c={c} y={l.y} fall={l.fall} />;
    case "kaaba":
      return <Kaaba key={k} c={c} x={l.x} y={l.y} build={l.build} />;
    case "ram": {
      const o = l.appear ? prog(c, l.appear) : 1;
      return <Ram key={k} x={l.x ?? 540} y={l.y ?? 1450} s={l.s ?? 1} o={o} />;
    }
    case "chest":
      return <Chest key={k} c={c} from={l.from} to={l.to} y={l.y} at={l.at} />;
    case "reeds":
      return <Reeds key={k} y={l.y} />;
    case "pyramids":
      return <Pyramids key={k} y={l.y} />;
    case "well":
      return <WellInside key={k} c={c} light={l.light} />;
    case "bucket":
      return <Bucket key={k} c={c} x={l.x} at={l.at} />;
    case "prison":
      return <PrisonWindow key={k} c={c} />;
    case "cows": {
      const lean = !!l.lean;
      const o = l.appear ? prog(c, l.appear) : 1;
      return (
        <g key={k}>
          {Array.from({ length: 7 }, (_, n) => (
            <Cow key={n} x={150 + (n % 4) * 260 + (n > 3 ? 130 : 0)} y={(l.y ?? 1400) + (n > 3 ? 220 : 0)} lean={lean} s={0.8} o={o} />
          ))}
        </g>
      );
    }
    case "ears":
      return <Ears key={k} c={c} green={l.green ?? true} x0={l.x0} y={l.y} n={l.n} grow={l.grow} />;
    case "granaries":
      return <Granaries key={k} y={l.y} fill={l.fill ? prog(c, l.fill) : undefined} />;
    case "shirt": {
      const p = prog(c, l.at);
      return <Shirt key={k} x={lerp(l.x0 ?? l.x ?? 540, l.x1 ?? l.x ?? 540, p)} y={lerp(l.y0 ?? l.y ?? 1250, l.y1 ?? l.y ?? 1250, p)} s={l.s ?? 1} o={l.o ?? 1} />;
    }
    case "eye":
      return <EyeLight key={k} c={c} at={l.at} />;
    case "prostration":
      return <Prostration key={k} c={c} at={l.at} cx={l.cx} cy={l.cy} />;
    case "throne":
      return <Throne key={k} x={l.x} y={l.y} />;
    case "staff":
      return <Staff key={k} c={c} x={l.x} y={l.y} turn={l.turn} />;
    case "ropes":
      return <Ropes key={k} c={c} y={l.y} vanish={l.vanish} />;
    case "seaSplit":
      return <SeaSplit key={k} c={c} at={l.at} close={l.close} />;
    case "crumble":
      return <Crumble key={k} c={c} at={l.at} />;
    case "tablets":
      return <Tablets key={k} c={c} appear={l.appear} />;
    case "fireTree":
      return <FireTree key={k} c={c} x={l.x} y={l.y} />;
    case "whale":
      return <Whale key={k} x={l.x ?? 540} y={l.y ?? 1200} s={l.s ?? 1} />;
    case "bubbles":
      return <Bubbles key={k} f={c.f} n={l.n} />;
    case "rays":
      return <LightRays key={k} f={c.f} opacity={l.opacity ?? 1} />;
    case "ground":
      return <rect key={k} x={0} y={l.y ?? 1500} width={W} height={H - (l.y ?? 1500)} fill={l.color ?? "#2c241f"} />;
    case "glow":
      return <circle key={k} cx={l.x ?? 540} cy={l.y ?? 1200} r={l.r ?? 500} fill="url(#orb)" opacity={(l.o ?? 0.35) * (l.at ? prog(c, l.at) : 1)} />;
    case "dim":
      return <rect key={k} width={W} height={H} fill={l.color ?? "#000"} opacity={(l.o ?? 0.4) * (l.at ? prog(c, l.at) : 1)} />;
    case "orb": {
      const p = prog(c, l.at);
      return <Orb key={k} x={lerp(l.x0 ?? l.x ?? 540, l.x1 ?? l.x ?? 540, p)} y={lerp(l.y0 ?? l.y ?? 900, l.y1 ?? l.y ?? 900, p)} r={l.r ?? 34} f={c.f} rays={l.rays ?? true} glow={l.glow ?? 1} />;
    }
    case "none":
      return <Rainbowless key={k} />;
    default:
      return null;
  }
}

export function LayeredScene({ layers, f, d }: { layers: Layer[]; f: number; d: number }) {
  const c = { f, d };
  return <>{layers.map((l, i) => renderLayer(l, c, i))}</>;
}
