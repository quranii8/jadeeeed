import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { getBook } from "@/lib/sahihayn";

type Row = [number, number, string, string, string]; // id, book, number label, normalised text, display text
const cache: Record<string, Row[]> = {};

function load(c: "bukhari" | "muslim"): Row[] {
  if (!cache[c]) cache[c] = JSON.parse(readFileSync(path.join(process.cwd(), "data", "sahihayn", `search-${c}.json`), "utf8"));
  return cache[c];
}

function norm(s: string) {
  return s
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

/** Full-text search over both Sahihs; every word of the query must appear in the hadith. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = norm(searchParams.get("q") ?? "");
  const only = searchParams.get("c");
  if (q.length < 2) return NextResponse.json({ total: 0, results: [] });
  const words = q.split(" ").filter(Boolean);
  const results: { c: string; book: number; bookTitle: string; id: number; num: string; snippet: string }[] = [];
  let total = 0;
  for (const c of ["bukhari", "muslim"] as const) {
    if (only && only !== c) continue;
    for (const [id, book, num, text, shown] of load(c)) {
      if (!words.every((w) => text.includes(w))) continue;
      total++;
      if (results.length >= 60) continue;
      // both strings share length up to letter unification, so the match position carries over
      const at = Math.max(0, text.indexOf(words[0]) - 60);
      results.push({
        c,
        book,
        bookTitle: getBook(c, book)?.book.title ?? "",
        id,
        num,
        snippet: (at > 0 ? "… " : "") + shown.slice(at, at + 220) + "…",
      });
    }
  }
  return NextResponse.json({ total, results }, { headers: { "Cache-Control": "public, s-maxage=86400" } });
}
