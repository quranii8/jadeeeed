"use client";

import dynamic from "next/dynamic";
import type { StoryPlace } from "@/lib/prophet-stories";

const Inner = dynamic(() => import("./PlacesMapInner"), {
  ssr: false,
  loading: () => <div className="h-72 md:h-96 w-full rounded-2xl skeleton" />,
});

export function PlacesMap({ places }: { places: StoryPlace[] }) {
  if (!places.length) return null;
  return (
    <section className="card p-5 md:p-7 mb-5">
      <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
        على الخريطة
      </h2>
      <Inner places={places} />
      <ul className="mt-4 space-y-2 text-sm">
        {places.map((p) => (
          <li key={p.name} className="flex gap-2">
            <span
              className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "var(--gold)", opacity: p.approx ? 0.5 : 1 }}
            />
            <span>
              <strong>{p.name}</strong>: {p.note}
              {p.approx && (
                <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>
                  (موضع تقريبي)
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
