"use client";

import { useEffect, useState } from "react";
import { Pause, Volume2 } from "lucide-react";

/** strips punctuation the voice would read aloud; keeps the diacritics, which help pronunciation */
function speakable(text: string) {
  return text.replace(/["“”«»‏]/g, " ").replace(/\s+/g, " ").trim();
}

function arabicVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "ar-SA") ?? voices.find((v) => v.lang?.startsWith("ar"));
}

let current: string | null = null;

/** Reads a hadith with the visitor's own Arabic device voice (free, works for every hadith). */
export function SpeakButton({ id, text, label = "استمع" }: { id: string; text: string; label?: string }) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    window.speechSynthesis.getVoices();
    const stop = () => setPlaying(current === id && window.speechSynthesis.speaking);
    const t = setInterval(stop, 500);
    return () => clearInterval(t);
  }, [id]);

  if (!supported) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (playing) {
      synth.cancel();
      current = null;
      setPlaying(false);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(speakable(text));
    u.lang = "ar-SA";
    const v = arabicVoice();
    if (v) u.voice = v;
    u.rate = 0.9;
    u.onend = () => {
      if (current === id) current = null;
      setPlaying(false);
    };
    current = id;
    synth.speak(u);
    setPlaying(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors"
      style={{
        background: playing ? "var(--gold)" : "var(--primary-soft)",
        color: playing ? "#1A1204" : "var(--primary)",
      }}
      aria-pressed={playing}
    >
      {playing ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />}
      {playing ? "إيقاف" : label}
    </button>
  );
}
