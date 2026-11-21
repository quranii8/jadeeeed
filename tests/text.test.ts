import { test } from "node:test";
import assert from "node:assert/strict";
import { stripBismillah } from "../src/lib/utils.ts";
import { htmlToText } from "../src/lib/tafsir-source.ts";

// Text as served by api.alquran.cloud (quran-uthmani) — uses tatweel before the dagger alif
const BASMALA_API = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

test("strips the basmala from verse 1 when the API spells it with tatweel", () => {
  assert.equal(stripBismillah(`${BASMALA_API} الٓمٓ`, 2), "الٓمٓ");
});

test("strips the basmala spelled without tatweel", () => {
  assert.equal(stripBismillah("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ", 2), "الٓمٓ");
});

test("keeps the basmala in Al-Fatiha, where it is verse 1", () => {
  assert.equal(stripBismillah(BASMALA_API, 1), BASMALA_API);
});

test("leaves text that does not start with the basmala untouched", () => {
  assert.equal(stripBismillah("بَرَآءَةٌۭ مِّنَ ٱللَّهِ", 9), "بَرَآءَةٌۭ مِّنَ ٱللَّهِ");
  assert.equal(stripBismillah("قُلْ هُوَ ٱللَّهُ أَحَدٌ", 112), "قُلْ هُوَ ٱللَّهُ أَحَدٌ");
});

test("does not strip when verse 1 is only the basmala-like phrase of Surah An-Naml 30", () => {
  // An-Naml 27:30 contains the basmala mid-verse; verse 1 there does not start with it
  assert.equal(stripBismillah("طسٓ ۚ تِلْكَ", 27), "طسٓ ۚ تِلْكَ");
});

test("htmlToText turns quran.com tafsir HTML into plain paragraphs", () => {
  const html =
    '<p><span class="arabic qpc-hafs">( الذين يؤمنون بالغيب )</span></p><p lang="ar" class="ar ">قال أبو &amp; جعفر&nbsp;هنا</p>';
  assert.equal(htmlToText(html), "( الذين يؤمنون بالغيب )\n\nقال أبو & جعفر هنا");
});

test("htmlToText returns empty string for empty input", () => {
  assert.equal(htmlToText(""), "");
});
