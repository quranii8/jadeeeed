"use client";

import { useEffect, useState } from "react";
import { useExtras, type Skin } from "@/lib/extras-store";

const SKINS: { id: Skin; label: string; swatch: [string, string] }[] = [
  { id: "fajr", label: "الفجر", swatch: ["#1C2A6E", "#E2B35A"] },
  { id: "andalus", label: "الأندلسي", swatch: ["#1B3A8C", "#D99A1E"] },
  { id: "kiswah", label: "الكسوة", swatch: ["#121214", "#C9A24B"] },
];

/** Cycles the site's worlds: the cinematic Fajr dawn, Andalusian zellige, and the black-and-gold Kiswah. */
export function SkinSwitch({ compact = false }: { compact?: boolean }) {
  const skin = useExtras((s) => s.skin);
  const setSkin = useExtras((s) => s.setSkin);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const current = SKINS.findIndex((s) => s.id === (ready ? skin : "fajr"));
  const next = SKINS[(current + 1) % SKINS.length];

  return (
    <button
      type="button"
      onClick={() => setSkin(next.id)}
      className={`field-btn inline-flex items-center gap-2 rounded ${compact ? "w-10 h-10 justify-center" : "px-3 h-10 text-sm font-semibold"}`}
      aria-label={`تغيير الثيم إلى ${next.label}`}
      title={`ثيم ${next.label}`}
    >
      <svg width="22" height="22" viewBox="-50 -50 100 100" aria-hidden="true">
        <path d="M0-46 13-31 32-32 31-13 46 0 31 13 32 32 13 31 0 46-13 31-32 32-31 13-46 0-31-13-32-32-13-31Z" fill={next.swatch[0]} stroke={next.swatch[1]} strokeWidth="7" strokeLinejoin="round" />
        <circle r="12" fill={next.swatch[1]} />
      </svg>
      {!compact && <span>{next.label}</span>}
    </button>
  );
}
