import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

type Row = [number, number, string, string]; // surah, ayah, normalised, without diacritics
let rows: Row[] | null = null;
const load = (): Row[] => (rows ??= JSON.parse(readFileSync(path.join(process.cwd(), "data", "quran", "search.json"), "utf8")) as Row[]);

const norm = (s: string) =>
  s.replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ").trim();

/** Every word of the query must appear in the ayah. */
export async function GET(req: Request) {
  const q = norm(new URL(req.url).searchParams.get("q") ?? "");
  if (q.length < 2) return NextResponse.json({ total: 0, results: [] });
  const words = q.split(" ");
  const hits = load().filter((r) => words.every((w) => r[2].includes(w)));
  return NextResponse.json(
    { total: hits.length, results: hits.slice(0, 100).map(([s, a, , t]) => ({ s, a, t })) },
    { headers: { "Cache-Control": "public, s-maxage=86400" } }
  );
}
