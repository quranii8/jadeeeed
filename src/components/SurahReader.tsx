"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Play, Languages, Type, Headphones, SlidersHorizontal, Minus, Plus, RotateCw } from "lucide-react";
import { Surah } from "@/lib/surahs";
import { useQuranStore } from "@/lib/store";
import { useAudioStore, AudioQueueItem } from "@/lib/audio-store";
import { toArabicNum, getAyahAudioUrl } from "@/lib/utils";
import { getReciter, getFullSurahUrl } from "@/lib/reciters";
import { VerseModal } from "./VerseModal";
import { AppIcon } from "@/components/AppIcon";

interface Verse {
  num: number;
  text: string;
  trans: string;
}

interface Props {
  surah: Surah;
  verses: Verse[];
  prev?: Surah;
  next?: Surah;
}

export function SurahReader({ surah, verses, prev, next }: Props) {
  const { fontSize, setFontSize, readMode, setReadMode, showTranslation, toggleTranslation, reciter } = useQuranStore();
  const { setLastRead, addToHistory, isBookmarked } = useQuranStore();
  const setQueue = useAudioStore((s) => s.setQueue);
  const [openVerse, setOpenVerse] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setLastRead(surah.n);
    addToHistory(surah.n);
  }, [surah.n, setLastRead, addToHistory]);

  /**
   * تشغيل السورة كاملة (ملف صوتي واحد متواصل من mp3quran)
   * هذا هو الوضع الافتراضي الجديد - أكثر سلاسة وبدون انقطاع بين الآيات
   */
  const playFullSurah = () => {
    const reciterInfo = getReciter(reciter);
    if (!reciterInfo) return;

    const fullUrl = getFullSurahUrl(reciterInfo, surah.n);
    if (!fullUrl) {
      // fallback لطريقة آية بآية إذا لم يتوفر سيرفر السورة الكاملة
      playVerseByVerse();
      return;
    }

    const item: AudioQueueItem = {
      surah: surah.n,
      url: fullUrl,
      title: `سورة ${surah.a}`,
      subtitle: reciterInfo.name,
      type: "full",
    };
    setQueue([item], 0);
  };

  /** تشغيل آية بآية (للوضع التعليمي / المراجعة) */
  const playVerseByVerse = (fromVerse: number = 1) => {
    const reciterInfo = getReciter(reciter);
    const queue: AudioQueueItem[] = verses.map((v) => ({
      surah: surah.n,
      verse: v.num,
      url: getAyahAudioUrl(reciter, surah.n, v.num),
      title: `سورة ${surah.a} — آية ${toArabicNum(v.num)}`,
      subtitle: reciterInfo?.name || "",
      type: "ayah",
    }));
    const startIndex = Math.max(0, fromVerse - 1);
    setQueue(queue, startIndex);
  };

  const showBismillah = surah.n !== 1 && surah.n !== 9;

  return (
    <>
      <Link href="/surahs" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        قائمة السور
      </Link>

      {/* Header */}
      <header
        className="page-band page-band--cobalt text-center relative overflow-hidden mb-6"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,169,81,.15), transparent 50%)",
          }}
        />
        <div className="relative">
          <div className="text-sm opacity-90">سورة</div>
          <h1 className="font-kufic text-5xl md:text-6xl font-bold mt-1">{surah.a}</h1>
          <div className="opacity-90 mt-2 text-base">
            {surah.e} — <em>{surah.trans}</em>
          </div>
          <div className="inline-flex gap-3 mt-4 px-5 py-1.5 rounded text-sm bg-white/15 backdrop-blur">
            <span>{surah.t === "makki" ? "مكية" : "مدنية"}</span>
            <span>•</span>
            <span>{toArabicNum(surah.v)} آية</span>
            <span>•</span>
            <span>السورة {toArabicNum(surah.n)}</span>
          </div>
        </div>
      </header>

      {/* Reading controls: on phones a single row (listen + settings) that scrolls away with the page,
          so nothing sits over the text; from md up the full card stays pinned under the header. */}
      <div
        className="card p-2.5 md:p-3 mb-5 md:sticky md:top-[72px] z-30"
        style={{ backdropFilter: "blur(10px)", background: "var(--surface)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={playFullSurah}
            className="btn btn-primary min-h-11 !py-2 !px-4 !text-sm"
            title="تشغيل ملف صوتي متواصل للسورة كاملة"
          >
            <Headphones className="w-4 h-4" aria-hidden="true" />
            استمع للسورة
          </button>
          <button
            onClick={() => playVerseByVerse()}
            className="btn btn-outline min-h-11 !py-2 !px-3 !text-sm"
            title="تشغيل آية بآية مع تتبّع النص (للحفظ)"
          >
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
            آية بآية
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-expanded={settingsOpen}
            aria-controls="reader-settings"
            className="btn btn-outline min-h-11 !py-2 !px-3 !text-sm mr-auto md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            الإعدادات
          </button>

          <div
            id="reader-settings"
            className={`${settingsOpen ? "flex" : "hidden"} md:flex w-full md:w-auto md:mr-auto flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-0`}
            style={{ borderColor: "var(--border-soft)" }}
          >
            <ControlGroup label="عرض">
              <Toggle active={readMode === "page"} onClick={() => setReadMode("page")}>صفحة</Toggle>
              <Toggle active={readMode === "list"} onClick={() => setReadMode("list")}>قائمة</Toggle>
            </ControlGroup>

            <ControlGroup label={<><Type className="w-3.5 h-3.5 inline" aria-hidden="true" /> الخط</>}>
              <button
                type="button"
                onClick={() => setFontSize(Math.max(1.2, Math.round((fontSize - 0.2) * 10) / 10))}
                disabled={fontSize <= 1.2}
                className="icon-btn !w-11 !h-11 disabled:opacity-40"
                aria-label="تصغير الخط"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-sm tabular-nums" aria-live="polite" style={{ color: "var(--text)" }}>
                {toArabicNum(Math.round(fontSize * 10))}
              </span>
              <button
                type="button"
                onClick={() => setFontSize(Math.min(2.6, Math.round((fontSize + 0.2) * 10) / 10))}
                disabled={fontSize >= 2.6}
                className="icon-btn !w-11 !h-11 disabled:opacity-40"
                aria-label="تكبير الخط"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </ControlGroup>

            <ControlGroup label={<><Languages className="w-3.5 h-3.5 inline" aria-hidden="true" /> الترجمة</>}>
              <Toggle active={showTranslation} onClick={toggleTranslation}>{showTranslation ? "إخفاء" : "إظهار"}</Toggle>
            </ControlGroup>
          </div>
        </div>
      </div>

      {/* البسملة */}
      {showBismillah && (
        <div className="bismillah-decorated text-2xl md:text-3xl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* الآيات */}
      {verses.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3"><AppIcon name="triangle-alert" /></div>
          <p style={{ color: "var(--text-muted)" }}>تعذّر تحميل الآيات. تحقق من الاتصال بالإنترنت ثم أعد المحاولة.</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-5">
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div
          className="plaster-tile p-5 md:p-10 font-hafs text-start md:text-justify"
          style={{
            fontSize: `${fontSize}rem`,
            lineHeight: 2.6,
          }}
        >
          {readMode === "list" ? (
            verses.map((v) => (
              <div
                key={v.num}
                id={`verse-${v.num}`}
                data-verse-key={`${surah.n}:${v.num}`}
                className="block mb-6 pb-5 border-b border-dashed cursor-pointer transition-colors rounded-lg p-2"
                style={{ borderColor: "var(--border)" }}
                onClick={() => setOpenVerse(v.num)}
              >
                <span className={isBookmarked(surah.n, v.num) ? "bg-amber-100/40 dark:bg-amber-900/20 rounded-md px-1" : ""}>
                  {v.text}
                  <span className="verse-end-mark">{toArabicNum(v.num)}</span>
                </span>
                {showTranslation && v.trans && (
                  <p
                    className="font-arabic text-sm mt-3 pt-2 border-t"
                    style={{ color: "var(--text-muted)", borderColor: "var(--gold)", direction: "ltr", textAlign: "left", lineHeight: 1.7 }}
                  >
                    {v.trans}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div>
              {verses.map((v, i) => (
                <span
                  key={v.num}
                  id={`verse-${v.num}`}
                  data-verse-key={`${surah.n}:${v.num}`}
                  className={`cursor-pointer transition-colors rounded-md hover:bg-[var(--primary-soft)] ${isBookmarked(surah.n, v.num) ? "bg-amber-100/40 dark:bg-amber-900/20" : ""}`}
                  onClick={() => setOpenVerse(v.num)}
                >
                  {v.text}
                  <span className="verse-end-mark">{toArabicNum(v.num)}</span>
                  {i < verses.length - 1 ? " " : ""}
                </span>
              ))}
              {showTranslation && (
                <div className="mt-6 pt-6 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                  {verses.map((v) => (
                    <p
                      key={`t-${v.num}`}
                      className="font-arabic text-sm mb-2"
                      style={{ color: "var(--text-muted)", direction: "ltr", textAlign: "left", lineHeight: 1.7 }}
                    >
                      <strong style={{ color: "var(--gold-dark)" }}>{v.num}.</strong> {v.trans}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* تنقل */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {prev ? (
          <Link href={`/surah/${prev.n}`} className="card p-4 flex items-center gap-3 hover:border-green-600 transition">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابقة</small>
              <div className="font-bold">{prev.a}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/surah/${next.n}`} className="card p-4 flex items-center gap-3 justify-end text-right hover:border-green-600 transition">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالية</small>
              <div className="font-bold">{next.a}</div>
            </div>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : <div />}
      </div>

      {/* Modal */}
      {openVerse !== null && (
        <VerseModal
          surah={surah}
          verse={verses.find((v) => v.num === openVerse)!}
          onClose={() => setOpenVerse(null)}
          onPlay={() => {
            playVerseByVerse(openVerse);
            setOpenVerse(null);
          }}
        />
      )}
    </>
  );
}

function ControlGroup({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 border-l last:border-0" style={{ borderColor: "var(--border)" }}>
      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}:</span>
      {children}
    </div>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="min-h-11 px-3.5 rounded-md text-sm font-medium transition-colors"
      style={{ background: active ? "var(--primary)" : "transparent", color: active ? "var(--on-primary)" : "var(--text-muted)" }}
    >
      {children}
    </button>
  );
}
