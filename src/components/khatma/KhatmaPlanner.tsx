"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Flame } from "lucide-react";
import { useExtras } from "@/lib/extras-store";
import { dayIndex, splitKhatma, streak, type Portion } from "@/lib/khatma";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

const PLANS = [
  { days: 7, label: "أسبوع" },
  { days: 15, label: "١٥ يوماً" },
  { days: 30, label: "شهر" },
  { days: 60, label: "شهران" },
  { days: 120, label: "أربعة أشهر" },
];

function range(p: Portion) {
  const a = getSurah(p.from.s)!;
  const b = getSurah(p.to.s)!;
  return p.from.s === p.to.s
    ? `سورة ${a.a}، من الآية ${toArabicNum(p.from.a)} إلى ${toArabicNum(p.to.a)}`
    : `من ${a.a} ${toArabicNum(p.from.a)} إلى ${b.a} ${toArabicNum(p.to.a)}`;
}

export function KhatmaPlanner() {
  const khatma = useExtras((s) => s.khatma);
  const startKhatma = useExtras((s) => s.startKhatma);
  const toggleDay = useExtras((s) => s.toggleDay);
  const endKhatma = useExtras((s) => s.endKhatma);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const portions = useMemo(() => (khatma ? splitKhatma(khatma.days) : []), [khatma]);
  if (!ready) return <div className="plaster-tile p-8" />;

  if (!khatma)
    return (
      <div>
        <h2 className="font-kufic font-bold text-2xl mb-2">اختر مدة ختمتك</h2>
        <p className="mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
          نقسّم المصحف على أيامك بأوراد متساوية في طولها، ولا نقطع آية.
        </p>
        <div className="tile-wall grid grid-cols-2 sm:grid-cols-5 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
          {PLANS.map((p, i) => (
            <button
              key={p.days}
              type="button"
              onClick={() => startKhatma(p.days)}
              className="wall-tile glaze p-5 text-right min-h-[7rem] flex flex-col justify-between"
              style={{ backgroundColor: ["var(--g-cobalt)", "var(--g-emerald)", "var(--g-terracotta)", "var(--g-ink)", "var(--g-saffron-deep)"][i], color: "var(--g-on)" }}
            >
              <span className="font-kufic font-bold text-2xl">{p.label}</span>
              <span className="text-xs" style={{ color: "var(--g-on-muted)" }}>
                نحو {toArabicNum(Math.round(604 / p.days))} صفحة في اليوم
              </span>
            </button>
          ))}
        </div>
      </div>
    );

  const today = dayIndex(khatma.start);
  const doneCount = khatma.done.length;
  const pct = Math.round((doneCount / khatma.days) * 100);
  const todayPortion = portions[Math.min(Math.max(today, 0), khatma.days - 1)];
  const finished = doneCount >= khatma.days;
  const s = streak(khatma.done, today);

  return (
    <div>
      <div className="tile-wall grid md:grid-cols-[1.4fr_1fr] gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        <div className="wall-tile p-6 md:p-8" style={{ backgroundColor: "var(--g-cobalt)", color: "var(--g-on)" }}>
          {finished ? (
            <>
              <div className="font-kufic font-bold text-3xl md:text-4xl">ختمت القرآن</div>
              <p className="mt-3" style={{ color: "var(--g-on-muted)" }}>تقبّل الله منك. ابدأ ختمة جديدة متى شئت.</p>
            </>
          ) : (
            <>
              <div className="text-sm" style={{ color: "var(--g-on-muted)" }}>
                ورد اليوم {today >= khatma.days ? "(تأخرت عن الخطة، أكمل من حيث وقفت)" : `، اليوم ${toArabicNum(today + 1)} من ${toArabicNum(khatma.days)}`}
              </div>
              <div className="font-kufic font-bold text-2xl md:text-3xl mt-2 leading-snug">{range(todayPortion)}</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/surah/${todayPortion.from.s}#verse-${todayPortion.from.a}`} className="btn btn-primary">
                  ابدأ ورد اليوم
                </Link>
                <button
                  type="button"
                  onClick={() => toggleDay(Math.min(Math.max(today, 0), khatma.days - 1))}
                  className="btn"
                  style={{ background: "var(--g-deep)", borderColor: "var(--g-plaster)", color: "var(--g-on)" }}
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  {khatma.done.includes(Math.min(Math.max(today, 0), khatma.days - 1)) ? "تم، إلغاء" : "قرأت ورد اليوم"}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="plaster-tile p-6 md:p-8 flex flex-col justify-between gap-4">
          <div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>التقدّم</div>
            <div className="font-kufic font-bold text-4xl">{toArabicNum(pct)}٪</div>
            <div className="mt-3 h-3 rounded" style={{ background: "var(--bg-soft)" }}>
              <div className="h-3 rounded" style={{ width: `${pct}%`, background: "var(--emerald)" }} />
            </div>
            <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
              {toArabicNum(doneCount)} من {toArabicNum(khatma.days)} ورداً
            </div>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Flame className="w-5 h-5" style={{ color: "var(--terracotta)" }} aria-hidden="true" />
            {s ? `${toArabicNum(s)} ${s === 1 ? "يوم" : "أيام"} متتالية` : "ابدأ سلسلتك اليوم"}
          </div>
        </div>
      </div>

      <h2 className="font-kufic font-bold text-2xl mt-10 mb-4">الأوراد</h2>
      <ol className="tile-wall grid sm:grid-cols-2 lg:grid-cols-3 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {portions.map((p, i) => {
          const done = khatma.done.includes(i);
          return (
            <li key={i} className="contents">
              <div className="plaster-tile p-4 flex items-center gap-3" style={i === today ? { boxShadow: "inset 0 0 0 2px var(--gold)" } : undefined}>
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  className="w-9 h-9 shrink-0 grid place-items-center rounded font-bold text-sm"
                  style={{ background: done ? "var(--emerald)" : "var(--bg-soft)", color: done ? "var(--on-primary)" : "var(--text-muted)" }}
                  aria-label={done ? `إلغاء إتمام اليوم ${i + 1}` : `تم اليوم ${i + 1}`}
                  aria-pressed={done}
                >
                  {done ? <Check className="w-4 h-4" aria-hidden="true" /> : toArabicNum(i + 1)}
                </button>
                <Link href={`/surah/${p.from.s}#verse-${p.from.a}`} className="text-sm leading-snug hover:underline">
                  {range(p)}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <button type="button" onClick={() => confirmEnd(endKhatma)} className="mt-8 text-sm font-semibold underline" style={{ color: "var(--terracotta)" }}>
        إنهاء هذه الختمة والبدء من جديد
      </button>
    </div>
  );
}

function confirmEnd(end: () => void) {
  if (window.confirm("هل تريد إنهاء هذه الختمة؟ سيُمسح تقدّمك فيها.")) end();
}
