import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const LIB = new URL("../src/lib/", import.meta.url);
const contentFiles = readdirSync(LIB).filter((f) => f.endsWith(".ts"));

// Chinese/Japanese/Korean and Cyrillic should never appear in Arabic content.
// (Russian is allowed only in the translations list of tafasir.ts.)
const FOREIGN = /[\u2E80-\u9FFF\uAC00-\uD7AF\u3040-\u30FF\uFF00-\uFFEF\u0400-\u04FF]/;

for (const file of contentFiles) {
  test(`${file}: no Chinese, Japanese, Korean or Cyrillic characters`, () => {
    const lines = readFileSync(new URL(file, LIB), "utf8").split("\n");
    const bad = lines
      .map((l, i) => ({ l, n: i + 1 }))
      .filter(({ l }) => FOREIGN.test(l) && !(file === "tafasir.ts" && l.includes("ru.kuliev")));
    assert.deepEqual(bad.map((b) => `${file}:${b.n}`), []);
  });
}

// English words glued into Arabic sentences (e.g. "ذهب money وأملاكه")
const ARABIC = "\u0600-\u06FF";
const LATIN_IN_ARABIC = new RegExp(`[${ARABIC}][ ،,]?[A-Za-z]{2,}(?:\\s[A-Za-z]+)*[ ،,.]?[${ARABIC}]`);

for (const file of ["prophets.ts", "hadith-nabawi.ts", "hadith-qudsi.ts", "adhkar.ts", "asma-allah.ts"]) {
  test(`${file}: no English words mixed into Arabic text`, () => {
    const lines = readFileSync(new URL(file, LIB), "utf8").split("\n");
    const bad = lines
      .map((l, i) => ({ l: l.replace(/<span class="quran-verse">|<\/span>/g, ""), n: i + 1 }))
      .filter(({ l }) => LATIN_IN_ARABIC.test(l));
    assert.deepEqual(bad.map((b) => `${file}:${b.n}`), []);
  });
}

test("prophets.ts: no unresolved placeholders", () => {
  const src = readFileSync(new URL("prophets.ts", LIB), "utf8");
  assert.doesNotMatch(src, /\{n\}|\{Q:/);
});
