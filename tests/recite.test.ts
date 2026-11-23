import { test } from "node:test";
import assert from "node:assert/strict";
import { align, normalizeArabic, sameWord, previewOk } from "../src/lib/recite.ts";

const words = (t: string) => t.split(/\s+/).map(normalizeArabic).filter(Boolean);
const FATIHA_2 = words("ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ");
const BAQARA_3 = words("ٱلَّذِينَ يُؤۡمِنُونَ بِٱلۡغَيۡبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقۡنَٰهُمۡ يُنفِقُونَ");

test("normalizes Uthmani spelling to bare letters", () => {
  assert.equal(normalizeArabic("ٱلۡعَٰلَمِينَ"), "العلمين");
  assert.equal(normalizeArabic("هُدٗى"), "هدي");
  assert.equal(normalizeArabic("ءَامَنُواْ"), "امنوا");
  assert.equal(normalizeArabic("ۛ"), "");
});

test("tolerates Uthmani versus modern spelling", () => {
  assert.ok(sameWord(normalizeArabic("ٱلصَّلَوٰةَ"), normalizeArabic("الصلاة")));
  assert.ok(sameWord(normalizeArabic("ٱلۡعَٰلَمِينَ"), normalizeArabic("العالمين")));
  assert.ok(sameWord(normalizeArabic("ٱلۡكِتَٰبُ"), normalizeArabic("الكتاب")));
  assert.ok(!sameWord("من", "ما"));
});

test("a correct recitation turns every word ok", () => {
  const a = align(FATIHA_2, "الحمد لله رب العالمين".split(" "));
  assert.deepEqual(a.status, ["ok", "ok", "ok", "ok"]);
  assert.equal(a.next, 4);
});

test("a wrong word is marked with what was heard", () => {
  const a = align(FATIHA_2, "الحمد لله ملك العالمين".split(" "));
  assert.deepEqual(a.status, ["ok", "ok", "wrong", "ok"]);
  assert.equal(a.heard[2], "ملك");
});

test("a skipped word is marked wrong and the reader stays in step", () => {
  const a = align(BAQARA_3, "الذين يؤمنون ويقيمون الصلاة".split(" "));
  assert.deepEqual(a.status.slice(0, 5), ["ok", "ok", "wrong", "ok", "ok"]);
  assert.equal(a.heard[2], "");
  assert.equal(a.next, 5);
});

test("an extra word before the right one is ignored", () => {
  const a = align(FATIHA_2, "الحمد يعني لله رب العالمين".split(" "));
  assert.deepEqual(a.status, ["ok", "ok", "ok", "ok"]);
});

test("a word heard split in two still matches", () => {
  const a = align(words("يَٰٓأَيُّهَا ٱلنَّاسُ"), "يا أيها الناس".split(" "));
  assert.deepEqual(a.status, ["ok", "ok"]);
});

test("disjoined letters match their spoken names", () => {
  const a = align(words("الٓمٓ ذَٰلِكَ"), "ألف لام ميم ذلك".split(" "));
  assert.deepEqual(a.status, ["ok", "ok"]);
});

test("alignment continues from an earlier result", () => {
  const first = align(FATIHA_2, ["الحمد", "لله"]);
  const second = align(FATIHA_2, ["رب", "العالمين"], first);
  assert.deepEqual(second.status, ["ok", "ok", "ok", "ok"]);
});

test("interim words only ever preview matches", () => {
  const start = align(FATIHA_2, ["الحمد"]);
  assert.deepEqual(previewOk(FATIHA_2, ["لله", "رب"], start), [1, 2]);
  assert.deepEqual(previewOk(FATIHA_2, ["خطأ"], start), []);
});
