#!/usr/bin/env node
/**
 * يبني src/data/prophet-stories.json من content/prophet-stories.spec.json
 *
 * - الآيات تُسحب حرفياً من المصحف (حزمة quran-json).
 * - الأحاديث تُسحب حرفياً من صحيح البخاري ومسلم (fawazahmed0/hadith-api).
 * - كل مرجع له كلمات expect يجب أن توجد في النص المسحوب، وإلا يتوقف البناء.
 *
 * ملفات الحديث تُحفظ في scripts/.cache. لتنزيلها:
 *   mkdir -p scripts/.cache && for c in bukhari muslim; do
 *     curl -sSo scripts/.cache/ara-$c.json https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-$c.min.json; done
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = new URL("../", import.meta.url);
const spec = JSON.parse(readFileSync(new URL("content/prophet-stories.spec.json", ROOT), "utf8"));
const quran = require("quran-json/dist/quran.json");

const COLLECTIONS = {
  bukhari: { name: "صحيح البخاري", slug: "bukhari" },
  muslim: { name: "صحيح مسلم", slug: "muslim" },
};

/** توحيد الكتابة للمقارنة فقط: بلا تشكيل، والألف الخنجرية ألف، وتوحيد الهمزات والتاء المربوطة */
export function norm(s) {
  return s
    .replace(/ٰ/g, "ا")
    .replace(/[ؐ-ًؚ-ٟۖ-ۭـ࣓-ࣿ‏‎]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/اا/g, "ا")
    .replace(/\s+/g, " ")
    .trim();
}

const errors = [];
const fail = (msg) => errors.push(msg);

function checkExpect(where, text, expect = []) {
  const n = norm(text);
  for (const e of expect) if (!n.includes(norm(e))) fail(`${where}: لم أجد «${e}»`);
}

function verses(ref) {
  const m = ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) throw new Error(`مرجع غير صالح: ${ref}`);
  const s = +m[1], from = +m[2], to = m[3] ? +m[3] : from;
  const surah = quran[s - 1];
  if (!surah || to > surah.total_verses || from > to) throw new Error(`مرجع خارج السورة: ${ref}`);
  const ayat = [];
  for (let a = from; a <= to; a++) ayat.push({ n: a, text: surah.verses[a - 1].text.replace(/۞\s*/g, "") });
  return { surah: s, surahName: surah.name, from, to, ayat };
}

// ── الحديث
const hadithDb = {};
function loadCollection(col) {
  if (hadithDb[col]) return hadithDb[col];
  const p = new URL(`scripts/.cache/ara-${col}.json`, ROOT);
  if (!existsSync(p)) throw new Error(`ملف ${col} غير موجود في scripts/.cache — راجع التعليق أعلى الملف`);
  const data = JSON.parse(readFileSync(p, "utf8"));
  hadithDb[col] = new Map(data.hadiths.map((h) => [h.hadithnumber, h]));
  return hadithDb[col];
}

/** يجد موضع عبارة في النص الأصلي بمقارنة موحّدة، ويرجع فهرسها في النص الأصلي */
function findPhrase(text, phrase, fromIdx = 0) {
  const target = norm(phrase);
  for (let i = fromIdx; i < text.length; i++) {
    if (/[\u0621-\u064A]/.test(text[i]) && norm(text.slice(i, i + phrase.length * 2)).startsWith(target)) return i;
  }
  return -1;
}

function hadith(h, where) {
  const db = loadCollection(h.col);
  const rec = db.get(h.num);
  if (!rec) return fail(`${where}: ${h.col} ${h.num} غير موجود`);
  const full = rec.text;
  const q = full.indexOf('"');
  if (q < 0) return fail(`${where}: لم أجد بداية المتن`);
  let start = q + 1;
  if (h.start) {
    start = findPhrase(full, h.start, q);
    if (start < 0) return fail(`${where}: لم أجد بداية «${h.start}»`);
  }
  let end;
  if (h.end) {
    const e = findPhrase(full, h.end, start);
    if (e < 0) return fail(`${where}: لم أجد نهاية «${h.end}»`);
    // نهاية الكلمة
    end = e;
    while (end < full.length && !/[\s،,.‏"]/.test(full[end])) end++;
  } else {
    end = full.indexOf('"', start);
    if (end < 0) end = full.length;
  }
  const text = full
    .slice(start, end)
    .replace(/[‏‎"]/g, "")
    .replace(/\s+([،.])/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/^[\s.،ـ-]+|[\s،ـ-]+$/g, "")
    .trim()
    .replace(/\{\s*/g, "﴿")
    .replace(/\s*\}/g, "﴾");
  const opens = (text.match(/﴿/g) ?? []).length, closes = (text.match(/﴾/g) ?? []).length;
  const fixed = opens > closes ? text + "﴾" : text;
  checkExpect(where, fixed, h.expect);
  if (h.contextExpect) checkExpect(`${where} (السياق)`, full, h.contextExpect);
  const c = COLLECTIONS[h.col];
  const number = rec.arabicnumber ?? rec.hadithnumber;
  const display = Number.isInteger(number) ? number : Math.floor(number);
  return {
    collection: c.name,
    number: display,
    text: fixed,
    context: h.context ?? null,
    url: `https://sunnah.com/${c.slug}:${display}`,
  };
}

const out = [];
for (const p of spec.prophets) {
  const stages = p.stages.map((st, i) => {
    const vs = st.verses.map((v) => {
      const r = verses(v.ref);
      checkExpect(`${p.id} / ${st.title} / ${v.ref}`, r.ayat.map((a) => a.text).join(" "), v.expect);
      return r;
    });
    return { title: st.title, summary: st.summary, verses: vs };
  });
  const hs = (p.hadith ?? []).map((h, i) => hadith(h, `${p.id} / حديث ${i + 1} (${h.col} ${h.num})`)).filter(Boolean);
  out.push({ id: p.id, title: p.title, intro: p.intro, places: p.places ?? [], stages, hadith: hs });
}

if (errors.length) {
  console.error(`✗ ${errors.length} خطأ:\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
writeFileSync(new URL("src/data/prophet-stories.json", ROOT), JSON.stringify(out, null, 1) + "\n");
const nv = out.reduce((s, p) => s + p.stages.reduce((t, st) => t + st.verses.reduce((u, v) => u + v.ayat.length, 0), 0), 0);
const nh = out.reduce((s, p) => s + p.hadith.length, 0);
console.log(`✓ ${out.length} نبياً، ${nv} آية، ${nh} حديثاً — كلها مطابقة للمصدر`);
