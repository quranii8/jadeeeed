/**
 * Static Quran data from quran-json (Uthmani text, verbatim):
 *  - public/data/quran/{n}.json   verses of each surah, for the memorisation page and offline use
 *  - src/lib/quran-weights.json   characters per ayah, to split a khatma into even daily portions
 *  - data/quran/search.json       [surah, ayah, normalised text, text without diacritics] for search
 * Run: node scripts/build-quran-data.mjs
 */
import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");

const DIA = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
const plain = (s) => s.replace(DIA, "").replace(/\s+/g, " ").trim();
const norm = (s) => plain(s).replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

mkdirSync("public/data/quran", { recursive: true });
mkdirSync("data/quran", { recursive: true });
const weights = [];
const search = [];
for (const s of quran) {
  writeFileSync(`public/data/quran/${s.id}.json`, JSON.stringify(s.verses.map((v) => v.text)));
  weights.push(s.verses.map((v) => plain(v.text).length));
  s.verses.forEach((v) => search.push([s.id, v.id, norm(v.text), plain(v.text)]));
}
writeFileSync("src/lib/quran-weights.json", JSON.stringify(weights));
writeFileSync("data/quran/search.json", JSON.stringify(search));
console.log("surahs", quran.length, "ayat", search.length);
