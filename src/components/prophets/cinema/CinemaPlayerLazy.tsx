"use client";

import dynamic from "next/dynamic";

/** المشغّل يُرسم في المتصفح فقط (حسابات الحركة تختلف بفروق عشرية بين الخادم والمتصفح) */
export const CinemaPlayerLazy = dynamic(() => import("./CinemaPlayer").then((m) => m.CinemaPlayer), {
  ssr: false,
  loading: () => (
    <section className="card p-4 md:p-6 mb-5">
      <div className="mx-auto w-full max-w-[420px] rounded-2xl skeleton" style={{ aspectRatio: "9 / 16" }} />
    </section>
  ),
});
