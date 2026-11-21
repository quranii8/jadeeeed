"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import type { VerseGroup } from "@/lib/prophet-stories";
import { getAyahAudioUrl, toArabicNum } from "@/lib/utils";

const RECITER = "Alafasy_128kbps";

/** آيات بنصّها من المصحف، مع تشغيل التلاوة آية بآية وتمييز الآية الجارية */
export function VerseCard({ group }: { group: VerseGroup }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const playFrom = (i: number) => {
    if (i >= group.ayat.length) {
      setPlaying(null);
      return;
    }
    const a = group.ayat[i];
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.src = getAyahAudioUrl(RECITER, group.surah, a.n);
    audio.onended = () => playFrom(i + 1);
    audio.onerror = () => setPlaying(null);
    setPlaying(i);
    audio.play().catch(() => setPlaying(null));
  };

  const toggle = () => {
    if (playing !== null) {
      audioRef.current?.pause();
      setPlaying(null);
    } else playFrom(0);
  };

  const range = group.from === group.to ? toArabicNum(group.from) : `${toArabicNum(group.from)}–${toArabicNum(group.to)}`;

  return (
    <figure className="rounded-2xl p-4 md:p-5" style={{ background: "var(--primary-soft)" }}>
      <p className="font-hafs text-xl md:text-2xl leading-[2.4] text-justify" style={{ color: "var(--text)" }}>
        {group.ayat.map((a, i) => (
          <span
            key={a.n}
            className="transition-colors rounded"
            style={playing === i ? { background: "var(--gold-light)", color: "#3b2f0a" } : undefined}
          >
            {a.text}{" "}
            <span className="text-base align-middle" style={{ color: "var(--gold-dark)" }}>
              ﴿{toArabicNum(a.n)}﴾
            </span>{" "}
          </span>
        ))}
      </p>
      <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm">
        <Link href={`/surah/${group.surah}`} className="font-semibold" style={{ color: "var(--primary)" }}>
          سورة {group.surahName.replace(/^سورة\s*/, "")} : {range}
        </Link>
        <button
          onClick={toggle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
          style={{ background: "var(--primary)" }}
          aria-label={playing !== null ? "إيقاف التلاوة" : "استمع للتلاوة"}
        >
          {playing !== null ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing !== null ? "إيقاف" : "استمع"}
        </button>
      </figcaption>
    </figure>
  );
}
