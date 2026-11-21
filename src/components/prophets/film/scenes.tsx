/**
 * مشاهد متحركة مرسومة بـ SVG. لا يُرسم فيها أي إنسان:
 * النبي يُرمز له بنور ذهبي فقط، والتركيز على الأحداث والطبيعة.
 */
import type { ReactNode } from "react";

const W = 400;
const H = 300;

function Defs() {
  return (
    <defs>
      <radialGradient id="f-orb">
        <stop offset="0" stopColor="#FFF6D6" />
        <stop offset="0.35" stopColor="#F3D27A" />
        <stop offset="1" stopColor="#C8A951" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="f-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d2b4f" />
        <stop offset="0.65" stopColor="#7c4a6b" />
        <stop offset="1" stopColor="#f2a65a" />
      </linearGradient>
      <linearGradient id="f-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070f1f" />
        <stop offset="1" stopColor="#13284a" />
      </linearGradient>
      <linearGradient id="f-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14507a" />
        <stop offset="1" stopColor="#06233d" />
      </linearGradient>
      <linearGradient id="f-deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b3d5c" />
        <stop offset="1" stopColor="#020c16" />
      </linearGradient>
      <linearGradient id="f-dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ec5e8" />
        <stop offset="0.7" stopColor="#ffe3b0" />
        <stop offset="1" stopColor="#ffd08a" />
      </linearGradient>
    </defs>
  );
}

/** رمز النبي: نور ذهبي ينبض */
function Orb({ x, y, r = 14, className = "f-pulse" }: { x: number; y: number; r?: number; className?: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r={r * 2.4} fill="url(#f-orb)" opacity="0.55" />
      <circle cx={x} cy={y} r={r} fill="url(#f-orb)" />
    </g>
  );
}

function Stars({ n = 22, seed = 1, maxY = 150 }: { n?: number; seed?: number; maxY?: number }) {
  const s: ReactNode[] = [];
  let h = seed * 9301;
  const r = () => ((h = (h * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++)
    s.push(
      <circle key={i} cx={r() * W} cy={r() * maxY} r={r() * 1.3 + 0.4} fill="white" className="f-twinkle" style={{ animationDelay: `${r() * 3}s` }} />
    );
  return <g>{s}</g>;
}

function Waves({ y, color = "#1b6a9c", opacity = 1, slow = false }: { y: number; color?: string; opacity?: number; slow?: boolean }) {
  const d = `M -400 ${y} q 25 -10 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V ${H} H -400 Z`;
  return <path d={d} fill={color} opacity={opacity} className={slow ? "f-wave-slow" : "f-wave"} />;
}

function City({ lit = false }: { lit?: boolean }) {
  const blocks = [
    [20, 70, 60], [85, 50, 85], [140, 70, 55], [215, 45, 95], [265, 65, 70], [335, 55, 80],
  ];
  return (
    <g>
      {blocks.map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={H - 40 - h} width={w} height={h} fill="#1f2340" />
          {i % 2 === 0 && <path d={`M ${x + w / 2 - 14} ${H - 40 - h} a 14 14 0 0 1 28 0 Z`} fill="#1f2340" />}
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={x + 8 + k * ((w - 16) / 3)}
              y={H - 40 - h + 16}
              width={7}
              height={10}
              fill={lit ? "#F3D27A" : "#2c3157"}
              className={lit ? "f-light-on" : undefined}
              style={lit ? { animationDelay: `${0.4 + i * 0.35 + k * 0.15}s` } : undefined}
            />
          ))}
        </g>
      ))}
      <rect x="0" y={H - 40} width={W} height="40" fill="#151830" />
    </g>
  );
}

function Ship({ x = 200, y = 175 }: { x?: number; y?: number }) {
  return (
    <g className="f-bob" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M ${x - 80} ${y} h 160 l -22 30 h -116 Z`} fill="#6b4226" />
      <rect x={x - 76} y={y - 10} width="152" height="10" fill="#8a5a36" />
      {[-55, -30, -5, 20, 45].map((dx) => (
        <rect key={dx} x={x + dx} y={y - 22} width="18" height="12" rx="2" fill="#a77b4f" />
      ))}
      <rect x={x - 2} y={y - 95} width="4" height="85" fill="#4a2e1a" />
      <path d={`M ${x + 2} ${y - 92} q 55 30 0 70 Z`} fill="#efe4cc" />
    </g>
  );
}

function Whale({ className = "", x = 200, y = 170 }: { className?: string; x?: number; y?: number }) {
  return (
    <g className={className}>
      <path
        d={`M ${x - 130} ${y} q 40 -60 140 -50 q 60 8 85 40 q 25 -25 40 -30 q -8 30 0 60 q -15 -5 -40 -30 q -25 40 -85 45 q -100 8 -140 -35 Z`}
        fill="#1c3b57"
      />
      <path d={`M ${x - 130} ${y} q 60 40 160 30`} stroke="#2f5d84" strokeWidth="3" fill="none" />
      <circle cx={x - 95} cy={y - 18} r="4" fill="#cfe3f2" />
    </g>
  );
}

function Bubbles() {
  return (
    <g>
      {[60, 110, 170, 250, 320, 360].map((x, i) => (
        <circle key={x} cx={x} cy={H - 10} r={3 + (i % 3)} fill="none" stroke="#8fc3e6" strokeWidth="1.2" className="f-bubble" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </g>
  );
}

const SCENES: Record<string, () => ReactNode> = {
  city: () => (
    <>
      <rect width={W} height={H} fill="url(#f-dusk)" />
      <circle cx="320" cy="210" r="34" fill="#f8c27a" opacity="0.8" />
      <Stars n={14} seed={3} maxY={90} />
      <City />
      <Orb x={200} y={70} r={16} />
    </>
  ),
  ship: () => (
    <>
      <rect width={W} height={H} fill="url(#f-night)" />
      <Stars n={26} seed={7} maxY={110} />
      <g className="f-drift">
        <ellipse cx="90" cy="60" rx="60" ry="16" fill="#1d2f4d" />
        <ellipse cx="300" cy="45" rx="70" ry="18" fill="#1d2f4d" />
      </g>
      <Waves y={200} color="#0f4468" opacity={0.9} slow />
      <Ship />
      <Orb x={225} y={150} r={8} />
      <Waves y={225} color="#16557f" />
    </>
  ),
  lots: () => (
    <>
      <rect width={W} height={H} fill="url(#f-night)" />
      <g className="f-rain">
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={(i * 37) % W} y1={(i * 53) % 160} x2={(i * 37) % W - 6} y2={((i * 53) % 160) + 14} stroke="#7fa7c9" strokeWidth="1" opacity="0.6" />
        ))}
      </g>
      <Waves y={200} color="#0f4468" opacity={0.9} slow />
      <Ship />
      {[0, 1, 2].map((k) => (
        <g key={k} className="f-rise" style={{ animationDelay: `${0.4 + k * 0.5}s` }}>
          <rect x={160 + k * 34} y="40" width="10" height="46" rx="3" fill={k === 2 ? "#F3D27A" : "#9aa7b8"} className={k === 2 ? "f-chosen" : undefined} />
        </g>
      ))}
      <g className="f-fall">
        <Orb x={225} y={150} r={8} className="" />
      </g>
      <circle cx="225" cy="232" r="4" fill="none" stroke="#bfe0f5" strokeWidth="2" className="f-ripple" />
      <circle cx="225" cy="232" r="4" fill="none" stroke="#bfe0f5" strokeWidth="2" className="f-ripple" style={{ animationDelay: "3.3s" }} />
      <Waves y={225} color="#16557f" />
    </>
  ),
  whale: () => (
    <>
      <rect width={W} height={H} fill="url(#f-deep)" />
      <Bubbles />
      <g className="f-sink">
        <Orb x={210} y={40} r={9} className="" />
      </g>
      <Whale className="f-swim" />
    </>
  ),
  darkness: () => (
    <>
      <rect width={W} height={H} fill="#03060c" />
      <rect x="20" y="20" width="360" height="260" rx="40" fill="#0a1426" className="f-fade" style={{ animationDelay: "0.2s" }} />
      <rect x="60" y="55" width="280" height="190" rx="36" fill="#0b2238" className="f-fade" style={{ animationDelay: "1.4s" }} />
      <rect x="105" y="90" width="190" height="120" rx="60" fill="#160d12" className="f-fade" style={{ animationDelay: "2.6s" }} />
      <text x="200" y="42" textAnchor="middle" fill="#6d84a8" fontSize="13" className="f-fade" style={{ animationDelay: "0.4s" }}>ظلمة الليل</text>
      <text x="200" y="78" textAnchor="middle" fill="#6d9cc0" fontSize="13" className="f-fade" style={{ animationDelay: "1.6s" }}>ظلمة البحر</text>
      <text x="200" y="112" textAnchor="middle" fill="#b0868f" fontSize="13" className="f-fade" style={{ animationDelay: "2.8s" }}>ظلمة بطن الحوت</text>
      <Orb x={200} y={160} r={7} className="f-pulse-slow" />
    </>
  ),
  tasbih: () => (
    <>
      <rect width={W} height={H} fill="#03060c" />
      <rect x="105" y="90" width="190" height="120" rx="60" fill="#160d12" />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx="200" cy="150" r="10" fill="none" stroke="#F3D27A" strokeWidth="1.5" className="f-ring" style={{ animationDelay: `${k * 0.9}s` }} />
      ))}
      <Orb x={200} y={150} r={10} className="f-grow" />
    </>
  ),
  rescue: () => (
    <>
      <rect width={W} height={H} fill="url(#f-sea)" />
      <rect width={W} height={H} fill="url(#f-dawn)" className="f-fade" style={{ animationDelay: "1.5s", animationDuration: "3s" }} />
      <circle cx="200" cy="150" r="20" fill="url(#f-orb)" className="f-burst" />
      <Whale className="f-leave" x={230} y={220} />
      <Orb x={200} y={150} r={12} />
    </>
  ),
  shore: () => (
    <>
      <rect width={W} height={H} fill="url(#f-dawn)" />
      <circle cx="80" cy="120" r="30" fill="#ffd27a" className="f-sunrise" />
      <path d={`M 0 200 q 100 -15 160 10 V ${H} H 0 Z`} fill="#3d8fbf" />
      <Waves y={215} color="#5aa9d6" opacity={0.8} slow />
      <path d={`M 120 230 q 120 -45 280 -40 V ${H} H 120 Z`} fill="#e8c98d" />
      <Orb x={270} y={205} r={9} className="f-pulse-slow" />
      <path d="M 300 200 C 300 150, 250 130, 250 95 C 250 70, 290 60, 310 75" fill="none" stroke="#3f7d3a" strokeWidth="4" strokeLinecap="round" className="f-draw" />
      {[
        [252, 120, -30], [300, 150, 25], [285, 80, -10], [240, 95, 20], [315, 110, 35],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x} cy={y} rx="26" ry="15" fill="#5fa45a" transform={`rotate(${rot} ${x} ${y})`} className="f-leaf" style={{ animationDelay: `${1.6 + i * 0.35}s`, transformOrigin: `${x}px ${y}px` }} />
      ))}
    </>
  ),
  believers: () => (
    <>
      <rect width={W} height={H} fill="url(#f-night)" />
      <Stars n={30} seed={11} maxY={130} />
      <City lit />
      <Orb x={200} y={65} r={14} />
    </>
  ),
};

export function SceneArt({ scene }: { scene: string }) {
  const Art = SCENES[scene] ?? SCENES.city;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="مشهد من القصة">
      <Defs />
      <Art />
    </svg>
  );
}

/** الحركات (تُعاد عند كل مشهد لأن الـ SVG يُعاد إنشاؤه) */
export const FILM_CSS = `
.f-pulse{animation:fPulse 2.4s ease-in-out infinite}
.f-pulse-slow{animation:fPulse 4s ease-in-out infinite}
@keyframes fPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.85}}
.f-twinkle{animation:fTw 3s ease-in-out infinite}
@keyframes fTw{0%,100%{opacity:.25}50%{opacity:1}}
.f-wave{animation:fWave 6s linear infinite}
.f-wave-slow{animation:fWave 10s linear infinite}
@keyframes fWave{from{transform:translateX(0)}to{transform:translateX(100px)}}
.f-bob{animation:fBob 3.2s ease-in-out infinite}
@keyframes fBob{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(6px) rotate(1.5deg)}}
.f-drift{animation:fDrift 14s ease-in-out infinite alternate}
@keyframes fDrift{to{transform:translateX(30px)}}
.f-rain{animation:fRain .6s linear infinite}
@keyframes fRain{from{transform:translateY(-14px)}to{transform:translateY(14px)}}
.f-rise{opacity:0;animation:fRise .7s ease-out forwards}
@keyframes fRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.f-chosen{animation:fChosen 1s ease-in-out 2.2s 3}
@keyframes fChosen{50%{fill:#fff6d6}}
.f-fall{animation:fFall 1.3s cubic-bezier(.5,0,.8,.4) 2.6s forwards}
@keyframes fFall{to{transform:translateY(85px);opacity:.2}}
.f-ripple{opacity:0;transform-origin:225px 232px;animation:fRipple 1.6s ease-out 3.6s forwards}
@keyframes fRipple{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(9)}}
.f-bubble{animation:fBubble 4s ease-in infinite}
@keyframes fBubble{from{transform:translateY(0);opacity:.9}to{transform:translateY(-280px);opacity:0}}
.f-sink{animation:fSink 3s ease-in forwards}
@keyframes fSink{to{transform:translateY(125px)}}
.f-swim{animation:fSwim 3.6s ease-out forwards}
@keyframes fSwim{from{transform:translateX(-330px)}to{transform:translateX(30px)}}
.f-fade{opacity:0;animation:fFade 1.2s ease-out forwards}
@keyframes fFade{to{opacity:1}}
.f-ring{transform-origin:200px 150px;animation:fRing 3.6s ease-out infinite;opacity:0}
@keyframes fRing{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(14)}}
.f-grow{animation:fGrow 5s ease-in-out forwards}
@keyframes fGrow{to{transform:scale(1.8)}}
.f-burst{transform-origin:200px 150px;animation:fBurst 3s ease-out forwards}
@keyframes fBurst{to{transform:scale(18);opacity:.35}}
.f-leave{animation:fLeave 4s ease-in forwards}
@keyframes fLeave{to{transform:translateX(320px)}}
.f-sunrise{animation:fSun 5s ease-out forwards}
@keyframes fSun{from{transform:translateY(70px)}to{transform:translateY(0)}}
.f-draw{stroke-dasharray:260;stroke-dashoffset:260;animation:fDraw 2.4s ease-out .6s forwards}
@keyframes fDraw{to{stroke-dashoffset:0}}
.f-leaf{transform:scale(0);animation:fLeaf .6s ease-out forwards}
@keyframes fLeaf{to{transform:scale(1)}}
.f-light-on{animation:fOn .5s ease-out forwards}
@keyframes fOn{from{fill:#2c3157}to{fill:#F3D27A}}
@media (prefers-reduced-motion: reduce){[class^="f-"],[class*=" f-"]{animation-duration:.01s!important;animation-iteration-count:1!important}}
`;
