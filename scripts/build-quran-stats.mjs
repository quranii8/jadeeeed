/**
 * The Quran in numbers, counted from the Uthmani text of quran-json.
 * Output: src/lib/quran-stats.json. Run: node scripts/build-quran-stats.mjs
 */
import { createRequire } from "module";
import { writeFileSync } from "fs";
const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");

const MARKS = /[ً-ٰٟۖ-ۭـ]/g;
const plain = (t) => t.normalize("NFC").replace(MARKS, "").replace(/ٱ/g, "ا");
const words = (t) => t.split(/\s+/).filter((w) => plain(w).replace(/[^ء-يٱ]/g, "").length > 0);
const letters = (t) => (plain(t).match(/[ء-ي]/g) || []).length;

const surahs = quran.map((s) => {
  const w = s.verses.reduce((n, v) => n + words(v.text).length, 0);
  const l = s.verses.reduce((n, v) => n + letters(v.text), 0);
  return { n: s.id, name: s.name, type: s.type === "meccan" ? "makki" : "madani", ayat: s.verses.length, words: w, letters: l };
});

// the fifteen places of prostration (Hafs), each checked against the text
const SAJDAT = [[7, 206], [13, 15], [16, 50], [17, 109], [19, 58], [22, 18], [22, 77], [25, 60], [27, 26], [32, 15], [38, 24], [41, 38], [53, 62], [84, 21], [96, 19]];
const sajdat = SAJDAT.map(([s, a]) => {
  // the sign sits at the end of the passage; the command or mention of prostration is in it or the ayah before
  const t = quran[s - 1].verses[a - 1].text + " " + quran[s - 1].verses[a - 2].text;
  const ok = /سجد|ٱسۡجُد|يَسۡجُد|سُجَّد|خَرُّواْ/.test(t) || /سجد|خروا|يخر|انيب|اناب|وأناب/.test(plain(t));
  if (!ok) throw new Error(`sajda check failed ${s}:${a}`);
  return { s, a, name: quran[s - 1].name };
});

// disjointed letters: surahs whose first ayah is only those letters
const NOORANI = new Set([..."الرمصكهيعطسحقن"]); // the fourteen letters that open surahs
const muqattaat = quran
  .filter((s) => {
    const first = s.verses[0].text.split(" ")[0];
    const p = plain(first).replace(/[^\u0621-\u064A]/g, "");
    return p.length > 0 && p.length <= 5 && [...p].every((ch) => NOORANI.has(ch)) && (first.includes("\u0653") || ["طه", "يس"].includes(p));
  })
  .map((s) => ({ n: s.id, name: s.name, letters: s.verses[0].text.split(" ")[0] }));

// ayat by length
const allAyat = quran.flatMap((s) => s.verses.map((v) => ({ s: s.id, a: v.id, name: s.name, words: words(v.text).length, letters: letters(v.text) })));
const longest = [...allAyat].sort((x, y) => y.letters - x.letters)[0];
const shortestAyat = allAyat.filter((x) => x.words === 1 && !muqattaat.some((m) => m.n === x.s && x.a === 1)).length;

// most frequent words (diacritics removed, the joined و ف ب ل left as written)
const freq = new Map();
for (const s of quran) for (const v of s.verses) for (const w of words(v.text)) {
  const k = plain(w).replace(/[^ء-ي]/g, "");
  if (k.length > 1) freq.set(k, (freq.get(k) || 0) + 1);
}
const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([w, n]) => ({ w, n }));

const sum = (f) => surahs.reduce((n, s) => n + f(s), 0);
const out = {
  totals: {
    surahs: surahs.length,
    ayat: sum((s) => s.ayat),
    words: sum((s) => s.words),
    letters: sum((s) => s.letters),
    makki: surahs.filter((s) => s.type === "makki").length,
    madani: surahs.filter((s) => s.type === "madani").length,
    makkiAyat: sum((s) => (s.type === "makki" ? s.ayat : 0)),
    madaniAyat: sum((s) => (s.type === "madani" ? s.ayat : 0)),
    oneWordAyat: shortestAyat,
  },
  longestAyah: longest,
  surahs,
  sajdat,
  muqattaat,
  top,
};
writeFileSync("src/lib/quran-stats.json", JSON.stringify(out));
console.log(out.totals, "muqattaat", muqattaat.length, "longest", longest, "top", top.slice(0, 8));
