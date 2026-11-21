"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Pause, Play, Repeat } from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { RECITERS } from "@/lib/reciters";
import { getAyahAudioUrl, toArabicNum } from "@/lib/utils";

type Mode = "show" | "first" | "hide";
const MODES: { id: Mode; label: string }[] = [
  { id: "show", label: "النص كاملاً" },
  { id: "first", label: "أوائل الكلمات" },
  { id: "hide", label: "مخفي للتسميع" },
];

const MARKS = "[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]*";
const CUE = new RegExp(`^((?:[\\u0648\\u0641\\u0628]${MARKS})?(?:[\\u0671\\u0627]${MARKS}\\u0644${MARKS})?)([\\u0621-\\u064A\\u0671]${MARKS})`);

/** the word's first real letter with its marks; a leading article (ال / ٱل) and a joined و ف ب stay with it */
function cue(word: string) {
  const m = word.match(CUE);
  return m ? m[1] + m[2] : word.slice(0, 1);
}

const field = { background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" } as const;

export function HifzTrainer() {
  const [surah, setSurah] = useState(1);
  const [verses, setVerses] = useState<string[]>([]);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(7);
  const [mode, setMode] = useState<Mode>("first");
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [repeat, setRepeat] = useState(3);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<{ a: number; r: number } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    fetch(`/data/quran/${surah}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((v: string[]) => {
        if (!alive) return;
        setVerses(v);
        setFrom(1);
        setTo(Math.min(v.length, surah === 1 ? 7 : 5));
        setRevealed(new Set());
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [surah]);

  const stop = () => {
    audio.current?.pause();
    setPlaying(false);
    setCurrent(null);
  };

  const playAyah = (a: number, r: number) => {
    if (!audio.current) audio.current = new Audio();
    const el = audio.current;
    el.src = getAyahAudioUrl(reciter, surah, a);
    setCurrent({ a, r });
    el.onended = () => {
      if (r + 1 < repeat) playAyah(a, r + 1);
      else if (a < to) playAyah(a + 1, 0);
      else stop();
    };
    el.play().catch(() => stop());
  };

  useEffect(() => () => audio.current?.pause(), []);
  useEffect(() => stop(), [surah, reciter]); // eslint-disable-line react-hooks/exhaustive-deps

  const range = useMemo(() => verses.slice(from - 1, to).map((t, i) => ({ a: from + i, words: t.split(/\s+/).filter(Boolean) })), [verses, from, to]);
  const toggleWord = (k: string) => setRevealed((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    return n;
  });

  return (
    <div>
      <div className="tile-wall grid sm:grid-cols-2 lg:grid-cols-4 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        <label className="plaster-tile p-4 block">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>السورة</span>
          <select value={surah} onChange={(e) => setSurah(Number(e.target.value))} className="w-full px-3 py-2.5 border-2 rounded" style={field}>
            {SURAHS.map((s) => (
              <option key={s.n} value={s.n}>{toArabicNum(s.n)}. {s.a}</option>
            ))}
          </select>
        </label>
        <div className="plaster-tile p-4">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>من الآية إلى الآية</span>
          <div className="flex gap-2">
            <select value={from} onChange={(e) => { const v = Number(e.target.value); setFrom(v); if (to < v) setTo(v); }} className="w-full px-3 py-2.5 border-2 rounded" style={field} aria-label="من الآية">
              {verses.map((_, i) => <option key={i} value={i + 1}>{toArabicNum(i + 1)}</option>)}
            </select>
            <select value={to} onChange={(e) => setTo(Number(e.target.value))} className="w-full px-3 py-2.5 border-2 rounded" style={field} aria-label="إلى الآية">
              {verses.map((_, i) => i + 1 >= from && <option key={i} value={i + 1}>{toArabicNum(i + 1)}</option>)}
            </select>
          </div>
        </div>
        <label className="plaster-tile p-4 block">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>القارئ</span>
          <select value={reciter} onChange={(e) => setReciter(e.target.value)} className="w-full px-3 py-2.5 border-2 rounded" style={field}>
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <div className="plaster-tile p-4">
          <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>تكرار كل آية</span>
          <div className="flex gap-1.5">
            {[1, 3, 5, 10].map((n) => (
              <button key={n} type="button" onClick={() => setRepeat(n)} className="flex-1 py-2.5 rounded font-bold text-sm" style={{ background: repeat === n ? "var(--primary)" : "var(--bg-soft)", color: repeat === n ? "var(--g-on)" : "var(--text)" }} aria-pressed={repeat === n}>
                {toArabicNum(n)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {MODES.map((m) => (
          <button key={m.id} type="button" onClick={() => { setMode(m.id); setRevealed(new Set()); }} className="px-4 py-2 rounded text-sm font-semibold" style={{ background: mode === m.id ? "var(--gold)" : "var(--surface)", color: mode === m.id ? "var(--g-on-saffron)" : "var(--text)", border: "1px solid var(--border)" }} aria-pressed={mode === m.id}>
            {m.label}
          </button>
        ))}
        <button type="button" onClick={() => (playing ? stop() : (setPlaying(true), playAyah(from, 0)))} className="btn btn-primary ms-auto">
          {playing ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          {playing ? "إيقاف" : "استمع وكرّر"}
        </button>
      </div>
      {current && (
        <p className="mt-2 text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--primary)" }}>
          <Repeat className="w-4 h-4" aria-hidden="true" />
          الآية {toArabicNum(current.a)}، المرة {toArabicNum(current.r + 1)} من {toArabicNum(repeat)}
        </p>
      )}

      {failed && <p className="plaster-tile p-5 mt-5 text-sm">تعذّر تحميل السورة. تحقق من الاتصال.</p>}

      <div className="mt-5 p-[5px]" style={{ background: "var(--grout-wall)" }}>
        <div className="plaster-tile p-5 md:p-10">
          {mode !== "show" && (
            <p className="mb-4 text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <Eye className="w-4 h-4" aria-hidden="true" />
              اضغط على أي كلمة لتكشفها، واضغط مرة ثانية لتخفيها.
            </p>
          )}
          <div className="font-hafs text-[1.7rem] md:text-[2.2rem] leading-[2.4] text-justify" lang="ar">
            {range.map(({ a, words }) => (
              <span key={a} className="rounded px-1 transition-colors" style={current?.a === a ? { background: "rgba(217,154,30,.22)" } : undefined}>
                {words.map((w, i) => {
                  const k = `${a}-${i}`;
                  const open = mode === "show" || revealed.has(k);
                  return (
                    <span key={k}>
                      <span
                        role={mode === "show" ? undefined : "button"}
                        tabIndex={mode === "show" ? undefined : 0}
                        onClick={() => mode !== "show" && toggleWord(k)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && mode !== "show" && (e.preventDefault(), toggleWord(k))}
                        className={mode === "show" ? undefined : "cursor-pointer rounded-sm transition-colors"}
                        style={open ? undefined : { background: "var(--bg-soft)", color: mode === "hide" ? "transparent" : "var(--text)", borderBottom: "2px solid var(--border)", boxDecorationBreak: "clone" }}
                        aria-label={open ? undefined : "كلمة مخفية، اضغط لكشفها"}
                      >
                        {open || mode === "hide" ? w : cue(w) + "ـ ـ"}
                      </span>{" "}
                    </span>
                  );
                })}
                <span className="verse-end-mark">{toArabicNum(a)}</span>{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
