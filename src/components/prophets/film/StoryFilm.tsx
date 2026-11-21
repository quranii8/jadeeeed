"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { FilmScene } from "@/lib/prophet-stories";
import { getAyahAudioUrl, toArabicNum } from "@/lib/utils";
import { FILM_CSS, SceneArt } from "./scenes";

const RECITER = "Alafasy_128kbps";
const SILENT_MS_PER_WORD = 650;

/**
 * القصة المتحركة: مشهد لكل حدث، والآيات تظهر كلمة بكلمة مع التلاوة.
 * عند تعطّل الصوت أو كتمه تمشي المشاهد بتوقيت ثابت.
 */
export function StoryFilm({ scenes }: { scenes: FilmScene[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 داخل المشهد
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ayahIdx = useRef(0);

  const scene = scenes[i];
  const words = scene.verses.ayat.flatMap((a, k) => [...a.text.split(" "), `﴿${toArabicNum(a.n)}﴾`].map((w) => ({ w, k })));
  // عدد الكلمات قبل كل آية، لحساب التقدّم عبر الآيات
  const ayahStarts = scene.verses.ayat.reduce<number[]>((acc, a, k) => {
    acc.push(k === 0 ? 0 : acc[k - 1] + scene.verses.ayat[k - 1].text.split(" ").length + 1);
    return acc;
  }, []);
  const shown = Math.ceil(progress * words.length);

  const stop = useCallback(() => {
    audio.current?.pause();
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const next = useCallback(() => {
    stop();
    setProgress(0);
    if (i < scenes.length - 1) setI(i + 1);
    else {
      setPlaying(false);
      setEnded(true);
    }
  }, [i, scenes.length, stop]);

  // تشغيل المشهد الحالي
  useEffect(() => {
    if (!playing) return;
    const total = words.length;
    const runSilent = () => {
      const start = Date.now();
      const dur = total * SILENT_MS_PER_WORD;
      timer.current = setInterval(() => {
        const p = Math.min(1, (Date.now() - start) / dur);
        setProgress(p);
        if (p >= 1) {
          if (timer.current) clearInterval(timer.current);
          setTimeout(next, 900);
        }
      }, 80);
    };
    if (muted) {
      runSilent();
      return stop;
    }
    const a = audio.current ?? new Audio();
    audio.current = a;
    ayahIdx.current = 0;
    const playAyah = (k: number) => {
      ayahIdx.current = k;
      a.src = getAyahAudioUrl(RECITER, scene.verses.surah, scene.verses.ayat[k].n);
      a.play().catch(() => {
        // المتصفح منع الصوت أو الملف تعذّر: كمّل بدون صوت
        setMuted(true);
      });
    };
    a.ontimeupdate = () => {
      if (!a.duration) return;
      const k = ayahIdx.current;
      const len = scene.verses.ayat[k].text.split(" ").length + 1;
      setProgress(Math.min(1, (ayahStarts[k] + (a.currentTime / a.duration) * len) / total));
    };
    a.onended = () => {
      if (ayahIdx.current < scene.verses.ayat.length - 1) playAyah(ayahIdx.current + 1);
      else {
        setProgress(1);
        setTimeout(next, 900);
      }
    };
    a.onerror = () => setMuted(true);
    playAyah(0);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, i, muted]);

  useEffect(() => stop, [stop]);

  const go = (n: number) => {
    stop();
    setEnded(false);
    setProgress(0);
    setI(Math.max(0, Math.min(scenes.length - 1, n)));
  };
  const toggle = () => {
    setStarted(true);
    if (ended) {
      setEnded(false);
      setI(0);
      setProgress(0);
      setPlaying(true);
      return;
    }
    if (playing) stop();
    setPlaying(!playing);
  };

  return (
    <section className="card overflow-hidden mb-5">
      <style dangerouslySetInnerHTML={{ __html: FILM_CSS }} />
      <div className="px-5 pt-5 md:px-7 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          شاهد القصة
        </h2>
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 rounded-full"
          style={{ background: "var(--bg-soft)" }}
          aria-label={muted ? "تشغيل التلاوة" : "كتم التلاوة"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative mt-4 bg-black">
        <div key={i} className="animate-fade-in">
          <SceneArt scene={scene.scene} />
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(0,0,0,.45)" }}>
          {toArabicNum(i + 1)} / {toArabicNum(scenes.length)} · {scene.title}
        </div>
        {(!started || ended) && (
          <button
            onClick={toggle}
            className="absolute inset-0 grid place-items-center"
            style={{ background: "rgba(0,0,0,.25)" }}
            aria-label={ended ? "أعد المشاهدة" : "تشغيل"}
          >
            <span className="w-16 h-16 rounded-full grid place-items-center shadow-lg" style={{ background: "var(--gold)" }}>
              {ended ? <RotateCcw className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white mr-[-3px]" />}
            </span>
          </button>
        )}
      </div>

      {/* الآية تظهر كلمة بكلمة */}
      <div className="px-5 md:px-7 py-5 min-h-[7.5rem]" style={{ background: "var(--primary-soft)" }}>
        <p className="font-quran text-xl md:text-2xl leading-[2.2] text-center" aria-live="polite">
          {words.map((x, k) => (
            <span
              key={k}
              className="transition-opacity duration-300"
              style={{ opacity: k < shown || (!playing && progress === 0) ? 1 : 0.12, color: x.w.startsWith("﴿") ? "var(--gold-dark)" : undefined }}
            >
              {x.w}{" "}
            </span>
          ))}
        </p>
        <p className="text-center text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          سورة {scene.verses.surahName.replace(/^سورة\s*/, "")}{" "}
          {scene.verses.from === scene.verses.to
            ? toArabicNum(scene.verses.from)
            : `${toArabicNum(scene.verses.from)}–${toArabicNum(scene.verses.to)}`}
        </p>
      </div>

      <div className="px-5 md:px-7 py-4 flex items-center justify-between gap-3">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="p-2 rounded-full disabled:opacity-30" aria-label="المشهد السابق">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {scenes.map((s, k) => (
            <button
              key={k}
              onClick={() => go(k)}
              aria-label={`المشهد ${k + 1}: ${s.title}`}
              className="h-2 rounded-full transition-all"
              style={{ width: k === i ? 22 : 8, background: k <= i ? "var(--gold)" : "var(--border)" }}
            />
          ))}
        </div>
        <button onClick={toggle} className="p-2 rounded-full" style={{ background: "var(--primary)", color: "white" }} aria-label={playing ? "إيقاف" : "تشغيل"}>
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button onClick={() => go(i + 1)} disabled={i === scenes.length - 1} className="p-2 rounded-full disabled:opacity-30" aria-label="المشهد التالي">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
