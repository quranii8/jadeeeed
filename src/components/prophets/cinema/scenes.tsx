import React from "react";
import { interpolate, Easing } from "remotion";
import { Bubbles, City, LightRays, Mountains, Orb, Rain, SandLines, Sea, Ship, Stars, W, H, Whale, clamp } from "./art";

type P = { f: number; d: number };
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const t = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

/** 37:139 — the messenger and his people: dusk over a riverside city */
function CityScene({ f, d }: P) {
  return (
    <>
      <rect width={W} height={H} fill="url(#dusk)" />
      <Stars n={50} f={f} seed="c" maxY={700} />
      <circle cx={760} cy={1180} r={110} fill="#f3b46a" opacity={0.55} filter="url(#soft)" />
      <Mountains y={1240} colors={["#4a2f4f", "#3a2645"]} />
      <City y={1420} f={f} color="#1d1a35" />
      <Sea y={1450} f={f} colors={["#2a3557", "#222b48", "#1a2139"]} amp={8} />
      <SandLines y0={1500} f={f} />
      <Orb x={540} y={interpolate(t(f, 0, d), [0, 1], [930, 880])} r={46} f={f} />
    </>
  );
}

/** 37:140 — he went to the laden ship */
function ShipScene({ f, d }: P) {
  const x = interpolate(f, [0, d], [380, 640]);
  return (
    <>
      <rect width={W} height={H} fill="url(#night)" />
      <Stars n={90} f={f} seed="s" maxY={1100} />
      <path d="M 830 820 a 70 70 0 1 0 50 120 a 56 56 0 1 1 -50 -120 Z" fill="#f4e2b0" opacity={0.9} />
      <Sea y={1360} f={f} colors={["#0f3150"]} amp={14} />
      <Ship x={x} y={1330} f={f} />
      <Orb x={x + 120} y={1260} r={16} f={f} rays={false} />
      <Sea y={1420} f={f} colors={["#123a5d", "#0d2c48", "#0a2036"]} amp={18} />
    </>
  );
}

/** 37:141 — the casting of lots in the storm, and he is cast into the sea */
function StormScene({ f, d }: P) {
  const flash = f % 70 < 4 ? 0.35 : 0;
  const fall = t(f, d * 0.45, d * 0.75);
  const ripple = t(f, d * 0.72, d);
  return (
    <>
      <rect width={W} height={H} fill="url(#storm)" />
      <rect width={W} height={H} fill="#dfe8ff" opacity={flash} />
      <Rain f={f} />
      <Sea y={1330} f={f} colors={["#13283d"]} amp={36} speed={1.6} />
      <Ship x={540} y={1300} f={f} tilt={2.6} />
      {[0, 1, 2].map((k) => {
        const appear = t(f, 10 + k * 18, 30 + k * 18);
        const chosen = k === 2 ? t(f, d * 0.3, d * 0.4) : 0;
        return (
          <rect
            key={k}
            x={430 + k * 90}
            y={720 - appear * 40}
            width={26}
            height={150}
            rx={8}
            fill={chosen > 0 ? "#F3D27A" : "#9aa9bb"}
            opacity={appear * (fall > 0.5 ? 1 - (fall - 0.5) * 2 : 1)}
          />
        );
      })}
      {fall < 1 && <Orb x={660} y={interpolate(fall, [0, 1], [1230, 1560])} r={16} f={f} rays={false} glow={1 - fall * 0.6} />}
      {ripple > 0 &&
        [0, 0.35].map((o) => {
          const r = interpolate(Math.max(0, ripple - o), [0, 0.65], [6, 220], clamp);
          return <ellipse key={o} cx={660} cy={1560} rx={r} ry={r * 0.28} fill="none" stroke="#c9e3f5" strokeWidth={4} opacity={1 - ripple} />;
        })}
      <Sea y={1420} f={f} colors={["#183450", "#0f263c", "#0a1b2c"]} amp={34} speed={1.6} />
    </>
  );
}

/** 37:142 — the whale swallows him */
function WhaleScene({ f, d }: P) {
  const sink = t(f, 0, d * 0.5);
  const swim = t(f, d * 0.1, d * 0.62);
  const gone = t(f, d * 0.55, d * 0.65);
  const wx = interpolate(swim, [0, 1], [-700, 470]);
  return (
    <>
      <rect width={W} height={H} fill="url(#deep)" />
      <LightRays f={f} />
      <Bubbles f={f} />
      {gone < 1 && <Orb x={540} y={interpolate(sink, [0, 1], [380, 1060])} r={20} f={f} rays={false} glow={1 - gone} />}
      <Whale x={wx} y={1120} s={1.05} open={interpolate(swim, [0.6, 0.85, 1], [0, 1, 0], clamp)} />
    </>
  );
}

/** 21:87 — the three darknesses: the night, the sea, the belly of the whale */
function DarknessScene({ f, d }: P) {
  const l = (k: number) => t(f, d * (0.05 + k * 0.18), d * (0.2 + k * 0.18));
  return (
    <>
      <rect width={W} height={H} fill="#020307" />
      <g opacity={l(0)}>
        <rect x={60} y={760} width={960} height={1040} rx={120} fill="#0a1124" />
        <Stars n={40} f={f} seed="dk" maxY={0} />
      </g>
      <rect x={140} y={880} width={800} height={820} rx={110} fill="#081d31" opacity={l(1)} />
      <ellipse cx={540} cy={1300} rx={290} ry={250} fill="#170b12" opacity={l(2)} />
      <Orb x={540} y={1300} r={14} f={f} rays={false} glow={0.35 + 0.25 * Math.sin(f / 22)} />
    </>
  );
}

/** 37:143 — he glorified Allah: light rings radiate in the dark */
function TasbihScene({ f, d }: P) {
  const g = t(f, 0, d);
  return (
    <>
      <rect width={W} height={H} fill="#020307" />
      <ellipse cx={540} cy={1300} rx={290} ry={250} fill="#170b12" />
      {Array.from({ length: 5 }, (_, k) => {
        const p = ((f + k * 22) % 110) / 110;
        return <circle key={k} cx={540} cy={1300} r={20 + p * 520} fill="none" stroke="#F3D27A" strokeWidth={3} opacity={(1 - p) * 0.8} />;
      })}
      <Orb x={540} y={1300} r={18 + g * 16} f={f} rays={g > 0.4} glow={0.6 + g * 0.6} />
    </>
  );
}

/** 37:144 — otherwise he would have remained there until the Day of Resurrection: the abyss */
function AbyssScene({ f, d }: P) {
  const sink = t(f, 0, d);
  return (
    <>
      <rect width={W} height={H} fill="url(#deep)" />
      <rect width={W} height={H} fill="#01060b" opacity={0.55 + sink * 0.25} />
      <Bubbles f={f} n={12} seed="ab" />
      <Whale x={540} y={interpolate(sink, [0, 1], [1050, 1350])} s={interpolate(sink, [0, 1], [0.55, 0.38])} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 97) % W} cy={((i * 211 + f * 1.2) % 900) + 1000} r={2} fill="#9cc3d9" opacity={0.25} />
      ))}
    </>
  );
}

/** 21:88 — We answered him and saved him from the distress: light rises through the water */
function RescueScene({ f, d }: P) {
  const rise = t(f, d * 0.1, d * 0.85);
  const burst = t(f, 0, d * 0.4);
  return (
    <>
      <rect width={W} height={H} fill="url(#deep)" />
      <rect width={W} height={H} fill="url(#dawn)" opacity={rise * 0.65} />
      <LightRays f={f} opacity={0.5 + rise * 0.5} />
      <circle cx={540} cy={1150} r={60 + burst * 900} fill="url(#orb)" opacity={0.45 * (1 - burst * 0.6)} />
      <Whale x={interpolate(rise, [0, 1], [560, 1500])} y={1500} s={0.7} />
      <Orb x={540} y={interpolate(rise, [0, 1], [1350, 1060])} r={34} f={f} glow={1 + rise * 0.3} />
    </>
  );
}

/** 37:145 — thrown onto the open shore while ill */
function ShoreScene({ f, d }: P) {
  const sun = t(f, 0, d);
  return (
    <>
      <rect width={W} height={H} fill="url(#dawn)" />
      <circle cx={280} cy={interpolate(sun, [0, 1], [1180, 1040])} r={95} fill="#ffd89a" opacity={0.9} />
      <Sea y={1240} f={f} colors={["#4f7fa6", "#3c6a91"]} amp={10} speed={0.6} />
      <path d={`M 260 1420 C 520 1300 760 1290 1120 1260 V ${H} H 260 Z`} fill="url(#sand)" />
      <path d={`M 260 1420 C 520 1300 760 1290 1120 1260`} stroke="#f7e3c0" strokeWidth={6} fill="none" opacity={0.5 + 0.3 * Math.sin(f / 20)} />
      <SandLines y0={1440} f={f} />
      <Orb x={720} y={1380} r={22} f={f} rays={false} glow={0.55} />
    </>
  );
}

/** 37:146 — a gourd vine grows over him */
function GourdScene({ f, d }: P) {
  const g = t(f, d * 0.05, d * 0.7);
  const leaves = [
    [640, 1150, -25, 0.2], [820, 1180, 30, 0.3], [600, 1010, -10, 0.45], [860, 1040, 20, 0.55], [700, 930, 0, 0.7], [780, 1260, 40, 0.4],
  ];
  return (
    <>
      <rect width={W} height={H} fill="url(#dawn)" />
      <circle cx={280} cy={1000} r={95} fill="#ffe1a8" opacity={0.9} />
      <Sea y={1240} f={f} colors={["#5f8db2", "#4b7aa0"]} amp={9} speed={0.6} />
      <path d={`M 260 1420 C 520 1300 760 1290 1120 1260 V ${H} H 260 Z`} fill="url(#sand)" />
      <SandLines y0={1440} f={f} />
      <Orb x={720} y={1380} r={22} f={f} rays={false} glow={0.55 + g * 0.35} />
      <path
        d="M 760 1380 C 760 1280 660 1230 640 1140 C 620 1050 700 980 740 930 C 790 880 860 960 840 1040"
        stroke="#3f7a3a"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={1200}
        strokeDashoffset={1200 * (1 - g)}
      />
      {leaves.map(([x, y, rot, at], i) => {
        const s = interpolate(g, [at, at + 0.15], [0, 1], clamp);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
            <path d="M 0 0 C 60 -70 150 -40 150 20 C 150 90 60 110 0 0 Z" fill={i % 2 ? "#5d9a54" : "#4c8a46"} />
            <path d="M 0 0 C 50 10 100 20 140 25" stroke="#2f6a2c" strokeWidth={4} fill="none" />
          </g>
        );
      })}
    </>
  );
}

/** 37:147 — sent to a hundred thousand or more: countless lights */
function MultitudeScene({ f, d }: P) {
  const n = Math.round(interpolate(t(f, 0, d * 0.8), [0, 1], [20, 420]));
  return (
    <>
      <rect width={W} height={H} fill="url(#night)" />
      <Stars n={40} f={f} seed="m" maxY={600} />
      {Array.from({ length: n }, (_, i) => {
        const x = ((i * 7919) % 1000) + 40;
        const y = 1000 + ((i * 104729) % 780);
        return <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill="#F3D27A" opacity={0.35 + 0.5 * (0.5 + 0.5 * Math.sin(f / 15 + i))} />;
      })}
      <Orb x={540} y={820} r={34} f={f} />
    </>
  );
}

/** 37:148 — they believed: the city fills with light */
function BelieversScene({ f, d }: P) {
  const lit = t(f, d * 0.05, d * 0.8);
  return (
    <>
      <rect width={W} height={H} fill="url(#dusk)" />
      <rect width={W} height={H} fill="#1a1530" opacity={0.45} />
      <Stars n={60} f={f} seed="bl" maxY={800} />
      <circle cx={540} cy={1250} r={420} fill="#F3D27A" opacity={lit * 0.25} filter="url(#soft)" />
      <City y={1500} f={f} lit={lit} color="#1d1a35" />
      <Orb x={540} y={900} r={44} f={f} glow={1 + lit * 0.4} />
    </>
  );
}

export const SCENES: Record<string, React.FC<P>> = {
  city: CityScene,
  ship: ShipScene,
  storm: StormScene,
  whale: WhaleScene,
  darkness: DarknessScene,
  tasbih: TasbihScene,
  abyss: AbyssScene,
  rescue: RescueScene,
  shore: ShoreScene,
  gourd: GourdScene,
  multitude: MultitudeScene,
  believers: BelieversScene,
};
