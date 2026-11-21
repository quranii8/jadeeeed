/**
 * Where each of the 99 names occurs in the Quran, found in the Uthmani text of quran-json.
 * A word matches a name when, ignoring the case ending and a joined و ف ب ل ك, its letters
 * and inner vowels equal the name with or without "ال". Output: src/lib/asma-occurrences.json
 * Run: node scripts/build-asma.mjs
 */
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";
const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");

const src = readFileSync("src/lib/asma-allah.ts", "utf8");
const names = [...src.matchAll(/\{ n: (\d+), ar: "([^"]+)"/g)].map((m) => ({ n: +m[1], ar: m[2] }));

const HARAKAT = /[ً-ٟ]/;
function norm(w) {
  return w
    .replace(/ؤ/g, "ء") // ra'uf with waw-hamza or hamza (before NFD splits the waw-hamza)
    .normalize("NFD") // one canonical order for shadda and vowel
    .replace(/ـ/g, "") // tatweel
    .replace(/ٱ/g, "ا") // alif wasla -> alif
    .replace(/ۡ/g, "") // Uthmani sukun
    .replace(/ْ/g, "") // sukun is often omitted in the name list
    .replace(/[ۖ-ۜ۟۠ۢ-ۭٓ-ٕ]/g, "") // pause marks, small letters, madda
    .replace(/ٰ/g, "ا") // dagger alif is a long a
    .replace(/َ/g, "") // fatha: the Mushaf drops it before a dagger alif; kasra and damma tell words apart
    .replace(/ؤ/g, "ء") // ra'uf with waw-hamza or hamza
    .replace(/ءُوُ?و/g, "ءُو")
    .replace(/ى/g, "ي");
}
/** drop the case ending: every mark after the last letter */
function stem(w) {
  let s = norm(w).replace(/[ًٖٗ]ا$/, ""); // the alif that carries tanween: hasiban
  while (s.length && (HARAKAT.test(s[s.length - 1]) || s[s.length - 1] === "ٰ")) s = s.slice(0, -1);
  return s;
}
/** the name without the article: "الرَّحِيم" → "رَحِيم" (the sun-letter shadda goes with the article) */
function bare(nameStem) {
  if (!nameStem.startsWith("ال")) return nameStem;
  let s = nameStem.slice(2);
  if (s[1] === "ّ") s = s[0] + s.slice(2);
  return s;
}

const targets = names.map(({ n, ar }) => {
  const st = stem(ar);
  return { n, forms: new Set([st, bare(st)]) };
});

const out = {};
for (const t of targets) out[t.n] = [];
const skeleton = (t) => t.normalize("NFD").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").replace(/\u0671/g, "\u0627");
const PHRASES = { 85: [/مالك الملك/, /ملك الملك/], 86: [/ذ[وي] الجلا?ل والاكرام/] };
for (const s of quran) {
  for (const v of s.verses) {
    const words = v.text.split(/\s+/);
    const hit = new Set();
    for (const raw of words) {
      const w = stem(raw);
      const cands = [w];
      // one joined particle: و ف ب ل ك with its vowel, also "وَلِ"/"فَبِ" style pairs
      const m = w.match(/^([وفبلك][َِ]?){1,2}/);
      if (m) cands.push(w.slice(m[0].length));
      // "لِلَّه" folds the article's alif into the lam
      if (/^لِ?لّ/.test(w)) cands.push("ال" + w.replace(/^لِ?/, ""));
      // a first letter doubled by a merged nun or tanween before it (qaribun mujib)
      for (const x of [...cands]) cands.push(x.replace(/^(.)([ً-ِ]?)ّ/, "$1$2"));
      for (const t of targets) if (!hit.has(t.n) && cands.some((c) => t.forms.has(c))) hit.add(t.n);
    }
    const sk = skeleton(v.text);
    for (const [n, res] of Object.entries(PHRASES)) if (res.some((r) => r.test(sk))) hit.add(+n);
    for (const n of hit) out[n].push([s.id, v.id]);
  }
}
writeFileSync("src/lib/asma-occurrences.json", JSON.stringify(out));
for (const { n, ar } of names) console.log(n, ar, out[n].length);
