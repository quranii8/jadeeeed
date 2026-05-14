"use client";

import { useState, useMemo } from "react";
import { Search, Copy, BookOpen, X, Filter } from "lucide-react";
import { HadithNabawi } from "@/lib/hadith-nabawi";
import { toArabicNum } from "@/lib/utils";

interface Props {
  hadiths: HadithNabawi[];
}

export function HadithNabawiBrowser({ hadiths }: Props) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [grade, setGrade] = useState<string>("all");

  const topics = useMemo(() => {
    const set = new Set<string>();
    hadiths.forEach((h) => set.add(h.topic));
    return Array.from(set);
  }, [hadiths]);

  const filtered = useMemo(() => {
    let arr = hadiths;
    if (topic !== "all") arr = arr.filter((h) => h.topic === topic);
    if (grade !== "all") arr = arr.filter((h) => h.grade === grade);
    if (q.trim()) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (h) =>
          h.text.includes(q) ||
          h.benefit?.includes(q) ||
          h.narrator.includes(q) ||
          h.source.toLowerCase().includes(ql)
      );
    }
    return arr;
  }, [hadiths, topic, grade, q]);

  const copy = (h: HadithNabawi) => {
    navigator.clipboard.writeText(
      `${h.text}\n\nراويه: ${h.narrator}\nالمصدر: ${h.source}\nالدرجة: ${h.grade}`
    );
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "صحيح":
        return { bg: "rgba(34,197,94,0.12)", text: "#22c55e" };
      case "حسن":
        return { bg: "rgba(234,179,8,0.12)", text: "#eab308" };
      default:
        return { bg: "rgba(239,68,68,0.12)", text: "#ef4444" };
    }
  };

  const getTopicIcon = (topic: string) => {
    const icons: Record<string, string> = {
      "أركان الإسلام": "🕋",
      "الإيمان": "🌟",
      "الصلاة": "🕌",
      "الأذان": "📢",
      "صلاة الجمعة": "🕌",
      "الزكاة والصدقة": "💰",
      "الصيام": "🌙",
      "الحج": "🏔️",
      "حسن الخلق": "💎",
      "المعاملات": "🤝",
      "العلم": "📚",
      "الذكر": "🔔",
      "التحذيرات": "⚠️",
      "الدعاء": "🤲",
      "العلاقات الاجتماعية": "👨‍👩‍👧‍👦",
      "الفضائل": "⭐",
      "الجهاد": "⚔️",
    };
    return icons[topic] || "📿";
  };

  return (
    <>
      {/* فلاتر + بحث */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث في الأحاديث النبوية..."
            className="w-full py-2.5 pr-10 pl-10 rounded-full text-sm outline-none border-2"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 icon-btn !w-7 !h-7"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="px-4 py-2.5 rounded-full text-sm outline-none border-2"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="all">كل المواضيع</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {getTopicIcon(t)} {t}
            </option>
          ))}
        </select>

        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="px-4 py-2.5 rounded-full text-sm outline-none border-2"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="all">كل الدرجات</option>
          <option value="صحيح">✅ صحيح</option>
          <option value="حسن">⚠️ حسن</option>
        </select>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4">
        <span style={{ color: "var(--text-muted)" }}>
          {toArabicNum(filtered.length)} حديثاً من أصل {toArabicNum(hadiths.length)}
        </span>
        {topic !== "all" && (
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
            }}
          >
            الموضوع: {topic}
          </span>
        )}
        {grade !== "all" && (
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: getGradeColor(grade).bg,
              color: getGradeColor(grade).text,
            }}
          >
            الدرجة: {grade}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p style={{ color: "var(--text-muted)" }}>لا توجد نتائج مطابقة</p>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            جرّب تغيير كلمات البحث أو الفلاتر
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((h) => {
            const gradeStyle = getGradeColor(h.grade);
            return (
              <div
                key={h.n}
                className="card p-6 md:p-7 transition-all hover:shadow-md"
                style={{ borderRight: "4px solid var(--gold)" }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                      }}
                    >
                      {toArabicNum(h.n)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: "var(--primary-soft)",
                          color: "var(--primary)",
                        }}
                      >
                        {getTopicIcon(h.topic)} {h.topic}
                      </span>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: gradeStyle.bg,
                          color: gradeStyle.text,
                        }}
                      >
                        {h.grade}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copy(h)}
                    className="icon-btn !w-8 !h-8"
                    title="نسخ الحديث"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* نص الحديث */}
                <p className="font-quran text-lg md:text-xl leading-loose mb-4">{h.text}</p>

                {/* المعلومات */}
                <div
                  className="flex flex-wrap gap-4 text-xs pt-3 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--text)" }}>الراوي:</strong>{" "}
                    {h.narrator}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--text)" }}>المصدر:</strong> {h.source}
                  </span>
                </div>

                {/* الفائدة */}
                {h.benefit && (
                  <div
                    className="mt-3 text-sm p-3 rounded-lg"
                    style={{ background: "var(--bg-soft)", color: "var(--text)" }}
                  >
                    💡 <strong style={{ color: "var(--gold-dark)" }}>الفائدة:</strong>{" "}
                    {h.benefit}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
