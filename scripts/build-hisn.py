"""
Builds the adhkar section from Hisn al-Muslim (Sa'id al-Qahtani), taken verbatim from
github.com/osamayy/azkar-db (azkar.json: chapter, text, virtue, count, source).
Output: src/lib/hisn-almuslim.json
Run: python3 scripts/build-hisn.py /path/to/azkar.json
"""
import json, os, re, sys, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/hisn/osama.json"

# chapters that already had pages keep their addresses
KEEP_IDS = {
    "أذكار الصباح": "morning",
    "أذكار المساء": "evening",
    "الأذكار بعد السلام من الصلاة": "after_salah",
    "أذكار النوم": "sleep",
    "أذكار الاستيقاظ من النوم": "wakeup",
}

GROUPS = [
    ("day", "الصباح والمساء والنوم", "sunrise", ["الصباح", "المساء", "النوم", "الاستيقاظ", "تقلب في الليل", "الفزع", "الرؤيا", "تعار من الليل"]),
    ("salah", "الطهارة والصلاة والمسجد", "mosque", ["الوضوء", "الخلاء", "المسجد", "الأذان", "الآذان", "الاستفتاح", "الركوع", "السجود", "سجود", "الجلسة", "التشهد", "الصلاة على النبي", "السلام من الصلاة", "الاستخارة", "القنوت", "الوتر", "قنوت"]),
    ("home", "البيت واللباس والطعام", "home", ["الثوب", "المنزل", "الطعام", "الصائم", "الشراب", "سقاه", "الضيف", "أفطر", "الإفطار", "اللبن", "الطيرة", "الأكل", "يسقي"]),
    ("hardship", "الهم والكرب والشدائد", "hand-heart", ["الهم", "الحزن", "الكرب", "العدو", "السلطان", "خاف", "الوسوسة", "وسوسة", "الدين", "المصيبة", "مصيبة", "أمر", "استصعب", "أذنب", "الشيطان", "الغضب", "غضب", "ظالم", "يكره", "يحب", "الدجال", "الشرك", "الكيد", "مردة الشياطين"]),
    ("illness", "المرض والموت والعزاء", "heart", ["المريض", "مريض", "الموت", "الميت", "الجنازة", "الصبي", "التعزية", "القبر", "المقابر", "حضره", "يئس", "الرقية", "يرقي", "العين", "الوجع", "ألم", "أغمض", "قضاء", "المحتضر", "للميت", "للفرط", "القبور", "مبتلى", "وجعا", "بعينه"]),
    ("travel", "السفر والطريق", "compass", ["السفر", "المسافر", "الركوب", "القرية", "البلدة", "السوق", "الدابة", "عثرت", "التكبير والتسبيح في سير", "السحر", "الطريق", "رجوع", "نزل منزلا", "نزل مترلا", "المقيم", "المركوب"]),
    ("nature", "المطر والريح والهلال", "cloud-sun", ["الريح", "الرعد", "المطر", "الاستسقاء", "الاستصحاء", "الهلال", "الغيم", "رأى باكورة", "باكورة", "الديك", "نهيق", "نباح"]),
    ("people", "الأسرة والناس", "users", ["الزواج", "المتزوج", "تزوج", "الجماع", "المولود", "التهنئة", "العطاس", "عطس", "السلام", "الكافر", "أحسن إليك", "صنع إليك", "معروف", "المجلس", "كفارة", "القرض", "أقرض", "الدعاء لمن", "سبك", "يمدح", "زكي", "يرد", "المسلم", "الذمي", "الأولاد", "إتيان الزوجة", "المجلس", "المحرم", "الحج", "العمرة", "الحجر الأسود", "الركن", "الصفا", "عرفة", "المشعر", "الجمار", "الهدي", "الذبح", "النحر", "التلبية"]),
]


def group_for(title: str) -> str:
    for gid, _, _, keys in GROUPS:
        if any(k in title for k in keys):
            return gid
    return "virtue"


def main():
    data = json.load(open(SRC, encoding="utf-8-sig"))
    cols = [c["name"] for c in data["columns"]]
    rows = [dict(zip(cols, r)) for r in data["rows"]]
    chapters, order = {}, []
    for r in rows:
        # titles only: fold Arabic presentation forms (one source title uses them) and fix one typo
        title = unicodedata.normalize("NFKC", r["category"]).strip().replace("مترلا", "منزلا")
        if title not in chapters:
            chapters[title] = []
            order.append(title)
        chapters[title].append({
            "text": r["zekr"].strip(),
            "count": int(r["count"] or 1),
            "reference": unicodedata.normalize("NFKC", r["reference"] or "").strip(),
            "benefit": (r["description"] or "").strip(),
        })
    out = []
    for i, title in enumerate(order, 1):
        out.append({"id": KEEP_IDS.get(title, f"h{i}"), "title": title, "group": group_for(title), "items": chapters[title]})
    groups = [{"id": g, "title": t, "icon": ic} for g, t, ic, _ in GROUPS] + [{"id": "virtue", "title": "فضل الذكر ومتفرقات", "icon": "sparkles"}]
    json.dump({"source": "حصن المسلم، سعيد بن علي بن وهف القحطاني", "groups": groups, "chapters": out},
              open(os.path.join(ROOT, "src", "lib", "hisn-almuslim.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print("chapters", len(out), "adhkar", sum(len(c["items"]) for c in out))
    for g in groups:
        n = [c["title"] for c in out if c["group"] == g["id"]]
        print(g["title"], len(n))
    print("virtue:", [c["title"] for c in out if c["group"] == "virtue"])


if __name__ == "__main__":
    main()
