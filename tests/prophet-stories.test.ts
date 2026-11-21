import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const quran = require("quran-json/dist/quran.json");
const stories = JSON.parse(readFileSync(new URL("../src/data/prophet-stories.json", import.meta.url), "utf8"));

test("every verse in the prophet stories is word-for-word the Quran text", () => {
  let n = 0;
  for (const p of stories)
    for (const st of p.stages)
      for (const g of st.verses)
        for (const a of g.ayat) {
          const real = quran[g.surah - 1].verses[a.n - 1].text.replace(/۞\s*/g, "");
          assert.equal(a.text, real, `${p.id} ${g.surah}:${a.n}`);
          n++;
        }
  assert.ok(n > 300, `expected 300+ verses, got ${n}`);
});

test("every prophet has a title, intro and at least one stage", () => {
  for (const p of stories) {
    assert.ok(p.title && p.intro, p.id);
    assert.ok(p.stages.length > 0, p.id);
  }
});

test("hadith come only from Bukhari or Muslim and link to the source", () => {
  for (const p of stories)
    for (const h of p.hadith) {
      assert.match(h.collection, /^صحيح (البخاري|مسلم)$/, p.id);
      assert.match(h.url, /^https:\/\/sunnah\.com\/(bukhari|muslim):\d+$/, p.id);
      assert.ok(h.text.length > 10, p.id);
    }
});
