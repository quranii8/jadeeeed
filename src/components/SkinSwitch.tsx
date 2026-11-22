"use client";

import { useEffect, useState } from "react";
import { useExtras, type Skin } from "@/lib/extras-store";

const SKINS: { id: Skin; label: string; swatch: [string, string] }[] = [
  { id: "andalus", label: "الروضة", swatch: ["#0B4A37", "#B8893A"] },
  { id: "kiswah", label: "الكسوة", swatch: ["#121214", "#C9A24B"] },
];

/** Switches between the site's worlds: Andalusian zellige and the black-and-gold Kiswah. */
export function SkinSwitch({ compact = false }: { compact?: boolean }) {
  const skin = useExtras((s) => s.skin);
  const setSkin = useExtras((s) => s.setSkin);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const next = SKINS.find((s) => s.id !== (ready ? skin : "andalus"))!;

  return (
    <button
      type="button"
      onClick={() => setSkin(next.id)}
      className={`field-btn inline-flex items-center gap-2 rounded-full ${compact ? "w-10 h-10 justify-center" : "px-3 h-10 text-sm font-semibold"}`}
      aria-label={`تغيير الثيم إلى ${next.label}`}
      title={`ثيم ${next.label}`}
    >
      <svg width="22" height="22" viewBox="-50 -50 100 100" aria-hidden="true">
        <circle r="44" fill={next.swatch[0]} stroke={next.swatch[1]} strokeWidth="6" />
        <path d="M0 22C-16 6-14-18 0-30 14-18 16 6 0 22Z" fill={next.swatch[1]} />
      </svg>
      {!compact && <span>{next.label}</span>}
    </button>
  );
}
