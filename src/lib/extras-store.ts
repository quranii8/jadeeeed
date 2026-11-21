"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedHadith = { c: string; book: number; id: number; num: string; matn: string; savedAt: number };
export type Khatma = { start: string; days: number; done: number[] }; // start = YYYY-MM-DD, done = finished day indexes

export type Skin = "andalus" | "kiswah";

type Extras = {
  skin: Skin;
  setSkin: (s: Skin) => void;
  hadiths: SavedHadith[];
  toggleHadith: (h: Omit<SavedHadith, "savedAt">) => boolean;
  isHadithSaved: (c: string, id: number) => boolean;
  khatma: Khatma | null;
  startKhatma: (days: number) => void;
  toggleDay: (i: number) => void;
  endKhatma: () => void;
};

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const useExtras = create<Extras>()(
  persist(
    (set, get) => ({
      skin: "andalus",
      setSkin: (skin) => set({ skin }),
      hadiths: [],
      toggleHadith: (h) => {
        const exists = get().hadiths.some((x) => x.c === h.c && x.id === h.id);
        set({ hadiths: exists ? get().hadiths.filter((x) => !(x.c === h.c && x.id === h.id)) : [{ ...h, savedAt: Date.now() }, ...get().hadiths] });
        return !exists;
      },
      isHadithSaved: (c, id) => get().hadiths.some((x) => x.c === c && x.id === id),
      khatma: null,
      startKhatma: (days) => set({ khatma: { start: todayKey(), days, done: [] } }),
      toggleDay: (i) => {
        const k = get().khatma;
        if (!k) return;
        set({ khatma: { ...k, done: k.done.includes(i) ? k.done.filter((d) => d !== i) : [...k.done, i].sort((a, b) => a - b) } });
      },
      endKhatma: () => set({ khatma: null }),
    }),
    { name: "quran-platform-extras" }
  )
);
