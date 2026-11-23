"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, RotateCcw, CheckCircle2, MicOff } from "lucide-react";
import { align, emptyAlignment, normalizeArabic, previewOk, type Alignment } from "@/lib/recite";
import { toArabicNum } from "@/lib/utils";

type Verse = { a: number; words: string[] };
type Token = { text: string; verse: number; e: number | null }; // e = index among the words to recite

// minimal typing for the Web Speech API, which TypeScript's DOM lib does not ship
type Alt = { transcript: string };
type Result = { isFinal: boolean; 0: Alt; length: number };
type ResultEvent = { resultIndex: number; results: { length: number; [i: number]: Result } };
type Recognizer = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: ResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognizerCtor = new () => Recognizer;

function getRecognizer(): RecognizerCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERRORS: Record<string, string> = {
  "not-allowed": "لم يُسمح باستخدام المايكروفون. اسمح به من إعدادات المتصفح ثم حاول مرة ثانية.",
  "service-not-allowed": "خدمة التعرّف على الصوت غير متاحة في هذا المتصفح.",
  "audio-capture": "لم نجد مايكروفوناً يعمل على هذا الجهاز.",
  network: "تعذّر الوصول إلى خدمة التعرّف على الصوت. تحقق من الاتصال ثم حاول مرة ثانية.",
};

/**
 * Hidden-text recitation check. The verses are covered; the reader recites aloud,
 * the browser's speech recognition turns it into text, and each word uncovers in
 * green when it was said right, or in red with a shake when it was wrong or skipped.
 */
export function ReciteCheck({ verses }: { verses: Verse[] }) {
  const tokens = useMemo<Token[]>(() => {
    let e = 0;
    return verses.flatMap(({ a, words }) => words.map((text) => ({ text, verse: a, e: normalizeArabic(text) ? e++ : null })));
  }, [verses]);
  const expected = useMemo(() => tokens.filter((t) => t.e !== null).map((t) => normalizeArabic(t.text)), [tokens]);

  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<Alignment>(() => emptyAlignment(expected.length));
  const [preview, setPreview] = useState<Set<number>>(new Set());
  const [hints, setHints] = useState<Set<number>>(new Set());
  const [shaking, setShaking] = useState<Set<number>>(new Set());
  const [heardLive, setHeardLive] = useState("");
  const [error, setError] = useState("");

  const rec = useRef<Recognizer | null>(null);
  const want = useRef(false);
  const resultRef = useRef(result);
  resultRef.current = result;

  useEffect(() => setSupported(getRecognizer() !== null), []);

  const done = result.next >= expected.length && expected.length > 0;
  const wrongCount = result.status.filter((s) => s === "wrong").length;
  const okCount = result.status.filter((s) => s === "ok").length;

  const stop = useCallback(() => {
    want.current = false;
    rec.current?.stop();
    setListening(false);
    setPreview(new Set());
    setHeardLive("");
  }, []);

  const onFinal = useCallback(
    (text: string) => {
      const before = resultRef.current;
      const after = align(expected, text.split(/\s+/), before);
      const fresh = new Set<number>();
      after.status.forEach((s, i) => s === "wrong" && before.status[i] !== "wrong" && fresh.add(i));
      resultRef.current = after;
      setResult(after);
      setPreview(new Set());
      if (fresh.size) {
        setShaking(fresh);
        navigator.vibrate?.(80);
        window.setTimeout(() => setShaking(new Set()), 600);
      }
      if (after.next >= expected.length) stop();
    },
    [expected, stop],
  );

  const start = () => {
    const Ctor = getRecognizer();
    if (!Ctor) return;
    setError("");
    const r = new Ctor();
    r.lang = "ar-SA";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let interim = "";
      for (let k = e.resultIndex; k < e.results.length; k++) {
        const res = e.results[k];
        if (res.isFinal) onFinal(res[0].transcript);
        else interim += res[0].transcript + " ";
      }
      setHeardLive(interim.trim());
      setPreview(new Set(previewOk(expected, interim.split(/\s+/), resultRef.current)));
    };
    r.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setError(ERRORS[e.error] ?? "حدث خطأ في التعرّف على الصوت. حاول مرة ثانية.");
      want.current = false;
    };
    // engines end a session after a pause; keep listening until the reader stops
    r.onend = () => {
      if (want.current) {
        try {
          r.start();
          return;
        } catch {
          /* fall through */
        }
      }
      setListening(false);
    };
    rec.current = r;
    want.current = true;
    try {
      r.start();
      setListening(true);
    } catch {
      setError("تعذّر تشغيل المايكروفون. حاول مرة ثانية.");
    }
  };

  const reset = () => {
    stop();
    const fresh = emptyAlignment(expected.length);
    resultRef.current = fresh;
    setResult(fresh);
    setHints(new Set());
    setError("");
  };

  // a new passage starts clean; leaving the page stops the microphone
  useEffect(() => {
    reset();
  }, [expected]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => {
    want.current = false;
    rec.current?.abort();
  }, []);

  const peek = (e: number) => setHints((s) => new Set(s).add(e));

  if (supported === false) {
    return (
      <div className="plaster-tile p-6 md:p-8 text-center">
        <MicOff className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        <p className="font-bold mb-1">متصفحك لا يدعم التعرّف على الصوت</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          افتح الصفحة في Chrome أو Edge أو Safari لتسمّع بصوتك، أو استخدم وضع «مخفي للتسميع» وتكشف الكلمات بنفسك.
        </p>
      </div>
    );
  }

  return (
    <div className="plaster-tile p-5 md:p-10">
      <div className="flex flex-col items-center text-center mb-6">
        <button
          type="button"
          onClick={() => (listening ? stop() : start())}
          disabled={done || supported === null}
          className="recite-mic relative w-20 h-20 rounded-full grid place-items-center disabled:opacity-50"
          data-on={listening ? "" : undefined}
          style={{ background: listening ? "var(--err)" : "var(--gold)", color: listening ? "#fff" : "var(--g-on-saffron)" }}
          aria-pressed={listening}
          aria-label={listening ? "إيقاف التسميع" : "ابدأ التسميع بصوتك"}
        >
          {listening ? <Square className="w-7 h-7" fill="currentColor" aria-hidden="true" /> : <Mic className="w-8 h-8" aria-hidden="true" />}
        </button>
        <p className="mt-3 font-bold" aria-live="polite">
          {done ? "انتهى التسميع" : listening ? "أسمعك… اقرأ من حيث توقفت" : result.next > 0 ? "اضغط لتكمل التسميع" : "اضغط وابدأ القراءة من حفظك"}
        </p>
        <p className="mt-1 text-sm min-h-[1.5rem]" style={{ color: "var(--text-muted)" }}>
          {listening && heardLive ? <>أسمع: {heardLive}</> : !done && <>الكلمة الصحيحة تظهر بالأخضر، والخطأ بالأحمر.</>}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm font-semibold" style={{ color: "var(--err)" }}>
            {error}
          </p>
        )}
      </div>

      <div className="font-hafs text-[1.7rem] md:text-[2.2rem] leading-[2.4] text-start md:text-justify" lang="ar">
        {verses.map(({ a }) => (
          <span key={a}>
            {tokens.map((t, k) => {
              if (t.verse !== a) return null;
              if (t.e === null) return <span key={k} style={{ color: "var(--text-soft)" }}>{t.text} </span>;
              const e = t.e;
              const st = result.status[e];
              const ok = st === "ok" || preview.has(e);
              const wrong = st === "wrong";
              const hint = !ok && !wrong && hints.has(e);
              const hidden = !ok && !wrong && !hint;
              const isNext = hidden && e === result.next && listening;
              return (
                <span key={k}>
                  <span
                    role={hidden ? "button" : undefined}
                    tabIndex={hidden ? 0 : undefined}
                    onClick={hidden ? () => peek(e) : undefined}
                    onKeyDown={hidden ? (ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), peek(e)) : undefined}
                    aria-label={hidden ? "كلمة مخفية، اضغط لتلميح" : undefined}
                    title={wrong ? (result.heard[e] ? `سمعتُ: ${result.heard[e]}` : "لم تُقرأ") : undefined}
                    className={`recite-word${ok || wrong ? " recite-in" : ""}${shaking.has(e) ? " recite-shake" : ""}${hidden ? " cursor-pointer" : ""}`}
                    data-state={ok ? "ok" : wrong ? "wrong" : hint ? "hint" : "hidden"}
                    data-next={isNext ? "" : undefined}
                  >
                    {t.text}
                  </span>{" "}
                </span>
              );
            })}
            <span className="verse-end-mark">{toArabicNum(a)}</span>{" "}
          </span>
        ))}
      </div>

      {(wrongCount > 0 || done) && (
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          {done && (
            <p className="flex items-center gap-2 font-bold text-lg mb-3">
              <CheckCircle2 className="w-5 h-5" style={{ color: "var(--ok)" }} aria-hidden="true" />
              {wrongCount === 0 ? "أحسنت، تسميع بلا أخطاء" : `صحيح ${toArabicNum(okCount)} من ${toArabicNum(expected.length)} كلمة`}
            </p>
          )}
          {wrongCount > 0 && (
            <ul className="space-y-1.5 text-sm">
              {tokens.map((t) =>
                t.e !== null && result.status[t.e] === "wrong" ? (
                  <li key={t.e} className="flex flex-wrap items-baseline gap-x-2">
                    <span style={{ color: "var(--text-muted)" }}>الآية {toArabicNum(t.verse)}:</span>
                    {result.heard[t.e] ? (
                      <>
                        قرأتَ <span className="font-bold" style={{ color: "var(--err)" }}>{result.heard[t.e]}</span> والصحيح
                      </>
                    ) : (
                      <>فاتتك كلمة</>
                    )}
                    <span className="font-hafs text-xl" style={{ color: "var(--ok)" }}>{t.text}</span>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={reset} className="btn btn-outline">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          ابدأ من جديد
        </button>
        <p className="text-xs max-w-sm" style={{ color: "var(--text-soft)" }}>
          يتحوّل صوتك إلى نص عبر خدمة التعرّف على الصوت في متصفحك، ولا نحفظ التسجيل. اضغط على كلمة مخفية لتلميح.
        </p>
      </div>
    </div>
  );
}
