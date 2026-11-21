"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuranStore } from "@/lib/store";
import { useExtras, type SavedHadith, type Khatma } from "@/lib/extras-store";

type Bookmark = { surah: number; verse: number; createdAt?: number };
type History = { surah: number; verse?: number; visitedAt: number };
type Synced = {
  bookmarks?: Bookmark[];
  history?: History[];
  lastRead?: { surah: number; verse?: number } | null;
  hadiths?: SavedHadith[];
  khatma?: Khatma | null;
  skin?: string;
  savedAt?: number;
};

const byKey = <T,>(list: T[], key: (x: T) => string) => {
  const m = new Map<string, T>();
  for (const x of list) if (!m.has(key(x))) m.set(key(x), x);
  return [...m.values()];
};

/** the khatma with more finished days wins; on a tie, the one started later */
const pickKhatma = (a?: Khatma | null, b?: Khatma | null) => {
  if (!a) return b ?? null;
  if (!b) return a;
  if (a.done.length !== b.done.length) return a.done.length > b.done.length ? a : b;
  return a.start >= b.start ? a : b;
};

function snapshot(): Synced {
  const q = useQuranStore.getState() as unknown as { bookmarks: Bookmark[]; history: History[]; lastRead: Synced["lastRead"] };
  const e = useExtras.getState();
  return { bookmarks: q.bookmarks, history: q.history, lastRead: q.lastRead, hadiths: e.hadiths, khatma: e.khatma, skin: e.skin, savedAt: Date.now() };
}

/**
 * When a visitor is signed in, everything they keep on this device is merged with their
 * account once, then every change is saved to the account a moment later. Signed out,
 * nothing leaves the device.
 */
export function ProgressSync() {
  const { status } = useSession();
  const ready = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (status !== "authenticated") {
      ready.current = false;
      return;
    }
    let alive = true;

    const push = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fetch("/api/sync", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(snapshot()), keepalive: true }).catch(() => undefined);
      }, 1500);
    };

    (async () => {
      try {
        const r = await fetch("/api/sync");
        if (!r.ok) return;
        const { data } = (await r.json()) as { data: Synced | null };
        if (!alive) return;
        if (data) {
          const local = snapshot();
          useQuranStore.setState({
            bookmarks: byKey([...(local.bookmarks ?? []), ...(data.bookmarks ?? [])], (b) => `${b.surah}:${b.verse}`),
            history: byKey(
              [...(local.history ?? []), ...(data.history ?? [])].sort((a, b) => b.visitedAt - a.visitedAt),
              (h) => String(h.surah)
            ).slice(0, 20),
            lastRead: local.lastRead ?? data.lastRead ?? null,
          } as never);
          useExtras.setState({
            hadiths: byKey([...(local.hadiths ?? []), ...(data.hadiths ?? [])], (h) => `${h.c}:${h.id}`),
            khatma: pickKhatma(local.khatma, data.khatma),
          });
        }
        ready.current = true;
        push(); // save the merged result back
      } catch {
        /* offline: try again on the next visit */
      }
    })();

    const unA = useQuranStore.subscribe(() => ready.current && push());
    const unB = useExtras.subscribe(() => ready.current && push());
    return () => {
      alive = false;
      unA();
      unB();
      clearTimeout(timer.current);
    };
  }, [status]);

  return null;
}
