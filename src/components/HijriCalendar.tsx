"use client";

import { useEffect, useMemo, useState } from "react";
import { toArabicNum } from "@/lib/utils";

const MONTHS = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
const WEEK = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric" });
const greg = new Intl.DateTimeFormat("ar", { weekday: "long", day: "numeric", month: "long" });

function hijri(d: Date) {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return { d: Number(p.day), m: Number(p.month), y: Number(String(p.year).replace(/\D/g, "")) };
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const EVENTS: { m: number; d: number; title: string; note?: string }[] = [
  { m: 1, d: 1, title: "رأس السنة الهجرية" },
  { m: 1, d: 10, title: "يوم عاشوراء", note: "يُستحب صيامه" },
  { m: 9, d: 1, title: "أول رمضان" },
  { m: 10, d: 1, title: "عيد الفطر" },
  { m: 12, d: 1, title: "أول العشر من ذي الحجة" },
  { m: 12, d: 9, title: "يوم عرفة", note: "يُستحب صيامه لغير الحاج" },
  { m: 12, d: 10, title: "عيد الأضحى" },
];

export function HijriCalendar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const data = useMemo(() => {
    if (!now) return null;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const h = hijri(today);
    // the current hijri month, day by day
    const start = addDays(today, -(h.d - 1));
    const month: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const d = addDays(start, i);
      if (hijri(d).m !== h.m) break;
      month.push(d);
    }
    // the next occurrence of each event, and the coming white days
    const upcoming: { date: Date; title: string; note?: string; days: number }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const d = addDays(today, i);
      const x = hijri(d);
      for (const e of EVENTS) {
        const k = `${e.m}-${e.d}`;
        if (x.m === e.m && x.d === e.d && !seen.has(k)) {
          seen.add(k);
          upcoming.push({ date: d, title: e.title, note: e.note, days: i });
        }
      }
      if (x.d === 13 && !seen.has("bid") && i < 45) {
        seen.add("bid");
        upcoming.push({ date: d, title: "الأيام البيض (١٣، ١٤، ١٥)", note: `من شهر ${MONTHS[x.m - 1]}، يُستحب صيامها`, days: i });
      }
    }
    upcoming.sort((a, b) => a.days - b.days);
    return { today, h, month, upcoming };
  }, [now]);

  if (!data) return <div className="plaster-tile p-10" />;
  const { today, h, month, upcoming } = data;
  const lead = month[0].getDay();

  return (
    <div>
      <div className="tile-wall grid md:grid-cols-[1fr_1.2fr] gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        <div className="wall-tile p-6 md:p-8 flex flex-col justify-between min-h-[14rem]" style={{ backgroundColor: "var(--g-cobalt)", color: "var(--g-on)" }}>
          <div className="text-sm" style={{ color: "var(--g-on-muted)" }}>{greg.format(today)}</div>
          <div>
            <div className="font-kufic font-bold text-7xl leading-none">{toArabicNum(h.d)}</div>
            <div className="font-kufic font-bold text-3xl mt-2">{MONTHS[h.m - 1]} {toArabicNum(h.y)} هـ</div>
          </div>
        </div>
        <div className="plaster-tile p-4 md:p-6">
          <div className="font-kufic font-bold text-xl mb-3">{MONTHS[h.m - 1]}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
            {WEEK.map((w) => <div key={w}>{w.slice(0, 3)}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: lead }).map((_, i) => <div key={`e${i}`} />)}
            {month.map((d, i) => {
              const isToday = d.getTime() === today.getTime();
              const white = i + 1 >= 13 && i + 1 <= 15;
              return (
                <div key={i} className="py-1.5 rounded" style={{ background: isToday ? "var(--gold)" : white ? "var(--primary-soft)" : "transparent", color: isToday ? "var(--g-on-saffron)" : "var(--text)" }}>
                  <div className="font-bold text-sm">{toArabicNum(i + 1)}</div>
                  <div className="text-[10px]" style={{ color: isToday ? "var(--g-on-saffron)" : "var(--text-soft)" }}>{toArabicNum(d.getDate())}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h2 className="font-kufic font-bold text-2xl mt-10 mb-4">المناسبات القادمة</h2>
      <ul className="tile-wall grid sm:grid-cols-2 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {upcoming.map((e) => (
          <li key={e.title} className="plaster-tile p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold">{e.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {greg.format(e.date)}{e.note ? `، ${e.note}` : ""}
              </div>
            </div>
            <div className="text-sm font-bold shrink-0" style={{ color: "var(--primary)" }}>
              {e.days === 0 ? "اليوم" : e.days === 1 ? "غداً" : `بعد ${toArabicNum(e.days)} يوماً`}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--text-soft)" }}>
        التاريخ محسوب بتقويم أم القرى. بداية الشهور الشرعية كرمضان والعيدين تكون برؤية الهلال، وقد تختلف يوماً عن التاريخ المحسوب.
      </p>
    </div>
  );
}
