"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { FilmShot } from "@/lib/prophet-stories";
import { getAyahAudioUrl } from "@/lib/utils";
import { Defs, H, W } from "./art";
import { SCENES } from "./scenes";
import { LayeredScene, type Layer } from "./kit";

const FPS = 30;
const PAD_MS = 900;
const FADE_MS = 650;
const RECITER = "Alafasy_128kbps";
const AR = "٠١٢٣٤٥٦٧٨٩";
const arNum = (n: number) => String(n).replace(/\d/g, (d) => AR[+d]);
const SURAH_EN: Record<string, string> = { "Al-Anbya": "AL-ANBIYA" };
/** مدة تقديرية عند كتم الصوت: حسب طول الآية */
const silentMs = (s: FilmShot) => Math.max(5200, s.ar.split(" ").length * 620 + 2200);

function Medallion({ n, size }: { n: number; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }} aria-hidden="true">
      <g fill="none" stroke="#D9B65E" strokeWidth={3}>
        <path d="M50 4 61 17 78 14 80 31 95 40 86 54 92 71 75 76 70 93 54 88 40 98 31 84 14 82 15 65 4 52 15 39 12 22 29 19 37 5Z" />
        <circle cx={50} cy={50} r={27} />
      </g>
      <text x={50} y={64} textAnchor="middle" fontFamily="Hafs" fontSize={n > 99 ? 30 : 38} fill="#F0D79A">
        {arNum(n)}
      </text>
    </svg>
  );
}

/** لقطة كاملة بقياس 1080×1920: المشهد + النص، ثم تُصغَّر لحجم الشاشة */
function Shot({ shot, f, durF, textOpacity = 1 }: { shot: FilmShot; f: number; durF: number; textOpacity?: number }) {
  const layers = shot.layers as Layer[] | null | undefined;
  const Scene = SCENES[shot.scene] ?? SCENES.city;
  const p = Math.min(1, f / durF);
  const scale = 1 + 0.07 * p;
  const a = Math.min(1, Math.max(0, (f - 8) / 22)) * textOpacity;
  const rise = Math.max(0, 18 - f * 0.7);
  const long = shot.ar.length > 90;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: "50% 60%" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
          <Defs />
          <defs>
            <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity={long ? 0.82 : 0.7} />
              <stop offset="0.6" stopColor="#000" stopOpacity={long ? 0.55 : 0.35} />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {layers?.length ? <LayeredScene layers={layers} f={f} d={durF} /> : <Scene f={f} d={durF} />}
          <rect width={W} height={H} fill="url(#vignette)" />
          <rect width={W} height={long ? 1450 : 1000} fill="url(#topShade)" />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 250, left: 70, right: 70, textAlign: "center", opacity: a, transform: `translateY(${rise}px)` }}>
        <div style={{ fontFamily: "Cinzel, serif", color: "#D9B65E", fontSize: 30, letterSpacing: 6 }} dir="ltr">
          SURAH {SURAH_EN[shot.surahNameEn] ?? shot.surahNameEn.toUpperCase()} ✦ VERSE {shot.ayah}
        </div>
        <div
          dir="rtl"
          style={{
            marginTop: 34,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
            fontFamily: "Hafs, var(--font-amiri), serif",
            fontSize: long ? 58 : 82,
            lineHeight: 1.9,
            color: "#FBF6EA",
            textShadow: "0 4px 24px rgba(0,0,0,.55)",
          }}
        >
          <span>{shot.ar}</span>
          <Medallion n={shot.ayah} size={long ? 70 : 88} />
        </div>
        <svg width={300} height={20} viewBox="0 0 300 20" style={{ marginTop: 18, display: "inline-block" }} aria-hidden="true">
          <line x1={0} y1={10} x2={130} y2={10} stroke="#D9B65E" strokeWidth={2} />
          <path d="M150 2 158 10 150 18 142 10Z" fill="#D9B65E" />
          <line x1={170} y1={10} x2={300} y2={10} stroke="#D9B65E" strokeWidth={2} />
        </svg>
        <div dir="ltr" style={{ marginTop: 18, fontFamily: "Garamond, Georgia, serif", fontSize: long ? 38 : 46, lineHeight: 1.35, color: "#F4EEDF", textShadow: "0 3px 18px rgba(0,0,0,.6)" }}>
          {shot.en}
        </div>
      </div>
    </div>
  );
}

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")";

/**
 * مشغّل الفيلم على الموقع: كل لقطة آية واحدة، والتلاوة تُشغَّل من everyayah مباشرة،
 * ومدة كل لقطة = مدة تلاوة آيتها. عند الكتم أو تعذّر الصوت تمشي بتوقيت تقديري.
 */
export function CinemaPlayer({ shots, title }: { shots: FilmShot[]; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [i, setI] = useState(0);
  const [f, setF] = useState(0);
  const [durMs, setDurMs] = useState(() => silentMs(shots[0]));
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prev, setPrev] = useState<{ idx: number; f: number; durF: number; at: number } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const clock = useRef({ base: 0, acc: 0 });
  const raf = useRef<number>(0);

  // تصغير مساحة 1080×1920 لعرض الصندوق
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (n: number, keepPlaying = true) => {
      setPrev({ idx: i, f, durF: (durMs / 1000) * FPS, at: performance.now() });
      clock.current = { base: performance.now(), acc: 0 };
      setF(0);
      setEnded(false);
      setI(n);
      setDurMs(silentMs(shots[n]));
      if (!keepPlaying) setPlaying(false);
    },
    [i, f, durMs, shots]
  );

  // الصوت لكل لقطة
  useEffect(() => {
    if (!started) return;
    const a = audio.current ?? new Audio();
    audio.current = a;
    a.pause();
    if (muted) return;
    a.src = getAyahAudioUrl(RECITER, shots[i].surah, shots[i].ayah);
    a.onloadedmetadata = () => isFinite(a.duration) && setDurMs(a.duration * 1000 + PAD_MS);
    a.onerror = () => setMuted(true);
    if (playing) a.play().catch(() => setMuted(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, started, muted]);

  useEffect(() => {
    const a = audio.current;
    if (!a || muted) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing, muted]);

  // الساعة
  useEffect(() => {
    if (!playing) return;
    clock.current.base = performance.now();
    let last = 0;
    const tick = (now: number) => {
      const ms = clock.current.acc + (now - clock.current.base);
      if (now - last > 1000 / FPS) {
        last = now;
        setF((ms / 1000) * FPS);
      }
      if (ms >= durMs) {
        if (i < shots.length - 1) goTo(i + 1);
        else {
          setPlaying(false);
          setEnded(true);
        }
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      clock.current.acc += performance.now() - clock.current.base;
    };
  }, [playing, durMs, i, shots.length, goTo]);

  useEffect(() => () => audio.current?.pause(), []);

  const toggle = () => {
    if (ended) {
      setStarted(true);
      goTo(0);
      setPlaying(true);
      return;
    }
    setStarted(true);
    setPlaying(!playing);
  };

  const durF = (durMs / 1000) * FPS;
  const fadeP = prev ? Math.min(1, (performance.now() - prev.at) / FADE_MS) : 1;

  return (
    <section className="card p-4 md:p-6 mb-5">
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--primary)" }}>
        شاهد القصة
      </h2>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {title} — آية بآية بتلاوة مشاري العفاسي
      </p>

      <div
        ref={boxRef}
        className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl bg-black select-none"
        style={{ aspectRatio: "9 / 16" }}
      >
        <div style={{ position: "absolute", top: 0, right: 0, width: W, height: H, transform: `scale(${k})`, transformOrigin: "top right" }}>
          <Shot shot={shots[i]} f={f} durF={durF} />
          {prev && fadeP < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - fadeP }}>
              <Shot shot={shots[prev.idx]} f={prev.f} durF={prev.durF} />
            </div>
          )}
        </div>
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25" style={{ backgroundImage: GRAIN }} />

        {/* شرائط التقدّم */}
        <div className="absolute top-2 inset-x-2 flex gap-1" dir="rtl">
          {shots.map((_, n) => (
            <div key={n} className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white/90" style={{ width: n < i ? "100%" : n === i ? `${Math.min(100, (f / durF) * 100)}%` : "0%" }} />
            </div>
          ))}
        </div>

        {(!started || ended) && (
          <button onClick={toggle} className="absolute inset-0 grid place-items-center bg-black/30" aria-label={ended ? "أعد المشاهدة" : "شغّل القصة"}>
            <span className="w-20 h-20 rounded-full grid place-items-center shadow-xl" style={{ background: "#C8A951" }}>
              {ended ? <RotateCcw className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white mr-[-4px]" />}
            </span>
          </button>
        )}

        {started && !ended && (
          <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent text-white">
            <button onClick={() => i > 0 && goTo(i - 1)} className="p-2" aria-label="الآية السابقة">
              <SkipForward className="w-5 h-5" />
            </button>
            <button onClick={toggle} className="p-3 rounded-full bg-white/20 backdrop-blur" aria-label={playing ? "إيقاف" : "تشغيل"}>
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={() => i < shots.length - 1 && goTo(i + 1)} className="p-2" aria-label="الآية التالية">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={() => setMuted(!muted)} className="p-2" aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}>
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button onClick={() => boxRef.current?.requestFullscreen?.()} className="p-2" aria-label="ملء الشاشة">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
