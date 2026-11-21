import weights from "./quran-weights.json";

export type Point = { s: number; a: number };
export type Portion = { from: Point; to: Point };

const W = weights as number[][];
const TOTAL = W.reduce((n, s) => n + s.reduce((m, x) => m + x, 0), 0);

/**
 * Splits the whole Quran into `days` portions of nearly equal reading length
 * (by letters of the Uthmani text), never breaking an ayah.
 */
export function splitKhatma(days: number): Portion[] {
  const out: Portion[] = [];
  let acc = 0;
  let day = 0;
  let from: Point = { s: 1, a: 1 };
  for (let s = 0; s < W.length; s++) {
    for (let a = 0; a < W[s].length; a++) {
      acc += W[s][a];
      const target = ((day + 1) * TOTAL) / days;
      const last = s === W.length - 1 && a === W[s].length - 1;
      if (acc >= target || last) {
        out.push({ from, to: { s: s + 1, a: a + 1 } });
        day++;
        from = a + 1 < W[s].length ? { s: s + 1, a: a + 2 } : { s: s + 2, a: 1 };
        if (day === days) return out;
      }
    }
  }
  return out;
}

export function dayIndex(start: string, now = new Date()): number {
  const [y, m, d] = start.split("-").map(Number);
  const s = new Date(y, m - 1, d);
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t.getTime() - s.getTime()) / 86400000);
}

/** consecutive finished days ending today or yesterday */
export function streak(done: number[], today: number): number {
  const set = new Set(done);
  let i = set.has(today) ? today : today - 1;
  let n = 0;
  while (set.has(i)) {
    n++;
    i--;
  }
  return n;
}
