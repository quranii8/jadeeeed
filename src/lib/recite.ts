/**
 * Recitation check: compares what speech recognition heard with the verse text,
 * word by word. Pure functions only, so the matching can be unit-tested.
 *
 * Speech engines return plain (imla'i) Arabic without diacritics, while the
 * verses are in Uthmani script, so both sides are reduced to bare letters and
 * matched with a small edit-distance tolerance ("الصلوة" ~ "الصلاة").
 */

// tashkeel, Quranic annotation marks, dagger alef, small high letters, tatweel
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;

export function normalizeArabic(word: string): string {
  return word
    .replace(MARKS, "")
    .replace(/[آأإٱٲٳ]/g, "ا") // آ أ إ ٱ → ا
    .replace(/ى/g, "ي") // ى → ي
    .replace(/ة/g, "ه") // ة → ه
    .replace(/ؤ/g, "و") // ؤ → و
    .replace(/ئ/g, "ي") // ئ → ي
    .replace(/^ء+/, "") // a leading hamza on the line (ءامنوا) is dropped
    .replace(/[^ء-ي]/g, ""); // keep letters only
}

function distance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

// the disjoined letters that open some surahs are recited by their names: الٓمٓ is "ألف لام ميم"
const LETTER_NAMES: Record<string, string> = {
  "\u0627": "الف", "\u0644": "لام", "\u0645": "ميم", "\u0631": "را", "\u0635": "صاد", "\u0643": "كاف",
  "\u0647": "ها", "\u064A": "يا", "\u0639": "عين", "\u0637": "طا", "\u0633": "سين", "\u062D": "حا",
  "\u0642": "قاف", "\u0646": "نون",
};
const MUQATTAAT = new Set(["الم", "المص", "الر", "المر", "كهيعص", "طه", "طسم", "طس", "يس", "ص", "حم", "عسق", "ق", "ن"]);

/** the spoken form of a disjoined-letters opening, or null for an ordinary word */
export function spokenLetters(expected: string): string | null {
  if (!MUQATTAAT.has(expected)) return null;
  return [...expected].map((c) => normalizeArabic(LETTER_NAMES[c] ?? c)).join("");
}

/** true when two normalized words are the same word, allowing one slip per four letters */
export function sameWord(expected: string, heard: string): boolean {
  if (!expected || !heard) return false;
  const allowed = Math.floor(Math.max(expected.length, heard.length) / 4);
  return distance(expected, heard) <= allowed;
}

export type WordStatus = "pending" | "ok" | "wrong";
export type Alignment = {
  status: WordStatus[];
  /** for a wrong word, what was heard in its place ("" when it was skipped) */
  heard: string[];
  /** index of the next expected word */
  next: number;
};

/**
 * Walks the heard words against the expected ones in order.
 * - a match (also across a split or merged word) turns the expected word ok;
 * - an expected word skipped before a match turns wrong (heard "");
 * - an extra heard word followed by the right one is ignored;
 * - anything else marks the expected word wrong with what was heard.
 */
export function align(expected: string[], heardWords: string[], start: Alignment = emptyAlignment(expected.length)): Alignment {
  const status = start.status.slice();
  const heard = start.heard.slice();
  let i = start.next;
  let j = 0;
  const h = heardWords.map(normalizeArabic).filter(Boolean);

  while (j < h.length && i < expected.length) {
    const e = expected[i];
    const spoken = spokenLetters(e);
    const spokenRun = spoken ? [1, 2, 3, 4, 5].find((n) => j + n <= h.length && sameWord(spoken, h.slice(j, j + n).join(""))) : undefined;
    if (spokenRun) {
      status[i++] = "ok";
      j += spokenRun;
    } else if (sameWord(e, h[j])) {
      status[i++] = "ok";
      j++;
    } else if (j + 1 < h.length && sameWord(e, h[j] + h[j + 1])) {
      status[i++] = "ok";
      j += 2;
    } else if (i + 1 < expected.length && sameWord(e + expected[i + 1], h[j])) {
      status[i++] = "ok";
      status[i++] = "ok";
      j++;
    } else {
      const skip = [1, 2].find((k) => i + k < expected.length && sameWord(expected[i + k], h[j]));
      if (skip) {
        for (let k = 0; k < skip; k++) {
          status[i] = "wrong";
          heard[i++] = "";
        }
        status[i++] = "ok";
        j++;
      } else if (j + 1 < h.length && sameWord(e, h[j + 1])) {
        j++; // an extra word before the right one
      } else {
        status[i] = "wrong";
        heard[i++] = heardWords[j] ?? h[j];
        j++;
      }
    }
  }
  return { status, heard, next: i };
}

export function emptyAlignment(n: number): Alignment {
  return { status: Array<WordStatus>(n).fill("pending"), heard: Array<string>(n).fill(""), next: 0 };
}

/**
 * Live preview from an unfinished (interim) phrase: only words that clearly
 * match are turned ok, never wrong, so the text does not flicker red while
 * the speaker is mid-word.
 */
export function previewOk(expected: string[], interimWords: string[], from: Alignment): number[] {
  const out: number[] = [];
  let i = from.next;
  for (const w of interimWords.map(normalizeArabic).filter(Boolean)) {
    if (i < expected.length && sameWord(expected[i], w)) out.push(i++);
    else break;
  }
  return out;
}
