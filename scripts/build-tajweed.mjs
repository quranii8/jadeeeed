/**
 * Real examples of each tajweed rule, found in the Uthmani text of quran-json, with how
 * often the rule occurs in the whole Mushaf. Output: src/lib/tajweed-examples.json
 * Run: node scripts/build-tajweed.mjs
 */
import { createRequire } from "module";
import { writeFileSync } from "fs";
const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");

const LETTER = /[ء-غف-يٱ]/;
const VOWELS = new Set(["َ", "ُ", "ِ"]);
const SHADDA = "ّ";
const SUKUN = new Set(["ْ", "ۡ"]);
const TANWEEN = new Set(["ً", "ٌ", "ٍ", "ٖ", "ٗ", "ٞ"]);
const MADDAH = "ٓ";
const HAMZA = new Set(["ء", "أ", "إ", "ؤ", "ئ", "آ"]);
const WASL = "ٱ";

const THROAT = new Set([...HAMZA, "ه", "ع", "ح", "غ", "خ"]);
const IDGHAM_G = new Set(["ي", "ن", "م", "و"]);
const IDGHAM_NG = new Set(["ل", "ر"]);
const IKHFA = new Set("صذثكجشقسدطزفتضظ".split(""));
const QALQALA = new Set("قطبجد".split(""));
const SHAMS = new Set("تثدذرزسشصضطظلن".split(""));

function units(word) {
  const u = [];
  for (const ch of word) {
    if (ch === "ـ") continue; // tatweel carries marks for the letter before it
    if (LETTER.test(ch)) u.push({ ch, marks: [] });
    else if (u.length) u[u.length - 1].marks.push(ch);
  }
  return u;
}
const hasVowel = (x) => x.marks.some((m) => VOWELS.has(m) || TANWEEN.has(m));
const isSakin = (x) => !hasVowel(x) && !x.marks.includes(SHADDA);
const firstLetter = (w) => units(w)[0];

const RULES = {
  izhar: [], idgham: [], iqlab: [], ikhfa: [],
  "izhar-shafawi": [], "idgham-shafawi": [], "ikhfa-shafawi": [],
  "madd-tabii": [], "madd-muttasil": [], "madd-munfasil": [], "madd-lazim": [], "madd-arid": [],
  qalqalah: [], ghunnah: [], "lam-shamsiyyah": [], "lam-qamariyyah": [],
};
const add = (id, s, a, words, i, j) => RULES[id].push({ s, a, i, j: j ?? i });

for (const sura of quran) {
  for (const v of sura.verses) {
    const words = v.text.split(" ");
    words.forEach((w, i) => {
      const u = units(w);
      const next = words[i + 1];
      const nf = next ? firstLetter(next) : null;
      const last = u[u.length - 1];
      // noon sakinah inside the word or at its end, and tanween at the end
      u.forEach((x, k) => {
        const isNoonSakin = x.ch === "ن" && isSakin(x) && !(k === 0);
        const after = k < u.length - 1 ? u[k + 1] : nf && nf.ch !== WASL ? nf : null;
        const isTanween = k === u.length - 1 || (k === u.length - 2 && /[اى]/.test(u[u.length - 1].ch) && !hasVowel(u[u.length - 1]));
        const tanween = isTanween && x.marks.some((m) => TANWEEN.has(m));
        if ((isNoonSakin || tanween) && after) {
          const across = k >= u.length - 2;
          const j = across && k === u.length - 1 || tanween ? i + 1 : i;
          if (THROAT.has(after.ch)) add("izhar", sura.id, v.id, words, i, j);
          else if (across && (k === u.length - 1 || tanween) && IDGHAM_G.has(after.ch)) add("idgham", sura.id, v.id, words, i, j);
          else if (across && (k === u.length - 1 || tanween) && IDGHAM_NG.has(after.ch)) add("idgham", sura.id, v.id, words, i, j);
          else if (after.ch === "ب") add("iqlab", sura.id, v.id, words, i, j);
          else if (IKHFA.has(after.ch)) add("ikhfa", sura.id, v.id, words, i, j);
        }
        // meem sakinah
        if (x.ch === "م" && isSakin(x)) {
          const aft = k < u.length - 1 ? u[k + 1] : nf && nf.ch !== WASL ? nf : null;
          if (aft) {
            const j = k === u.length - 1 ? i + 1 : i;
            if (aft.ch === "ب") add("ikhfa-shafawi", sura.id, v.id, words, i, j);
            else if (aft.ch === "م") add("idgham-shafawi", sura.id, v.id, words, i, j);
            else if (aft.ch !== "ا") add("izhar-shafawi", sura.id, v.id, words, i, j);
          }
        }
        // qalqalah: a qalqalah letter with sukun
        if (QALQALA.has(x.ch) && x.marks.some((m) => SUKUN.has(m))) add("qalqalah", sura.id, v.id, words, i);
        // ghunnah: noon or meem with shadda
        if ((x.ch === "ن" || x.ch === "م") && x.marks.includes(SHADDA)) add("ghunnah", sura.id, v.id, words, i);
        // the maddah sign marks the long madds
        if (x.marks.includes(MADDAH)) {
          // a silent alif (with the round zero, or bare at the end) does not count as the next letter
          let nx = u[k + 1];
          if (nx && (nx.ch === "ا" || nx.ch === "ى") && (nx.marks.includes("۟") || nx.marks.includes("ْ") || (k + 1 === u.length - 1 && !nx.marks.length))) nx = undefined;
          // vocative ya and the ha of attention are written joined but read as two words: munfasil
          if (k === 0 && (x.ch === "ي" || x.ch === "ه")) {
            add("madd-munfasil", sura.id, v.id, words, i);
            return;
          }
          if (nx && HAMZA.has(nx.ch)) add("madd-muttasil", sura.id, v.id, words, i);
          else if (nx && (nx.marks.includes(SHADDA) || isSakin(nx))) add("madd-lazim", sura.id, v.id, words, i);
          else if (!nx && nf && HAMZA.has(nf.ch)) add("madd-munfasil", sura.id, v.id, words, i, i + 1);
          else if (i === 0 && sura.id !== 9 && v.id === 1 && u.length <= 5) add("madd-lazim", sura.id, v.id, words, i);
        }
      });
      // lam of the article
      if (u[0] && u[0].ch === WASL && u[1] && u[1].ch === "ل" && u[2]) {
        if (u[2].marks.includes(SHADDA) && SHAMS.has(u[2].ch)) add("lam-shamsiyyah", sura.id, v.id, words, i);
        else if (u[1].marks.some((m) => SUKUN.has(m))) add("lam-qamariyyah", sura.id, v.id, words, i);
      }
    });
    // madd arid: the last word of an ayah with a madd letter before its last letter
    const lw = units(words[words.length - 1]);
    if (lw.length >= 3) {
      const p = lw[lw.length - 2], pp = lw[lw.length - 3];
      const madd = (p.ch === "ي" && pp.marks.includes("ِ") && !hasVowel(p)) || (p.ch === "و" && pp.marks.includes("ُ") && !hasVowel(p)) || (p.ch === "ا" && pp.marks.includes("َ"));
      if (madd && !lw[lw.length - 1].marks.includes(SHADDA)) add("madd-arid", sura.id, v.id, words, words.length - 1);
    }
    // natural madd: a madd letter with no hamza or sukun after it, inside a word
    words.forEach((w, i) => {
      const u = units(w);
      for (let k = 1; k < u.length - 1; k++) {
        const p = u[k - 1], x = u[k], n = u[k + 1];
        const m = (x.ch === "ا" && p.marks.includes("َ")) || (x.ch === "و" && p.marks.includes("ُ") && !hasVowel(x) && !x.marks.includes(SHADDA)) || (x.ch === "ي" && p.marks.includes("ِ") && !hasVowel(x) && !x.marks.includes(SHADDA));
        if (m && !x.marks.includes(MADDAH) && hasVowel(n) && !HAMZA.has(n.ch)) {
          add("madd-tabii", sura.id, v.id, words, i);
          break;
        }
      }
    });
  }
}

// keep a spread of examples across the Mushaf, with the words to highlight
const out = {};
for (const [id, list] of Object.entries(RULES)) {
  const step = Math.max(1, Math.floor(list.length / 40));
  const picks = [];
  const seen = new Set();
  for (let n = 0; n < list.length && picks.length < 40; n += step) {
    const e = list[n];
    const key = `${e.s}:${e.a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const words = quran[e.s - 1].verses[e.a - 1].text.split(" ");
    const from = Math.max(0, e.i - 2), to = Math.min(words.length, e.j + 3);
    picks.push({ s: e.s, a: e.a, before: words.slice(from, e.i).join(" "), mark: words.slice(e.i, e.j + 1).join(" "), after: words.slice(e.j + 1, to).join(" ") });
  }
  out[id] = { count: list.length, examples: picks };
}
writeFileSync("src/lib/tajweed-examples.json", JSON.stringify(out));
for (const [id, v] of Object.entries(out)) console.log(id, v.count, v.examples[0] ? v.examples[0].mark : "");
