"""
Build the complete Sahihayn (Sahih al-Bukhari + Sahih Muslim) data for the site.

Sources (texts are copied verbatim, never edited):
  - scripts/.cache/ara-bukhari.json, ara-muslim.json  (fawazahmed0/hadith-api: full Arabic text,
    standard numbering, book boundaries)
  - /tmp/hj/{bukhari,muslim}.json  (AhmedBaset/hadith-json: Arabic book titles only)

Outputs:
  - public/data/sahihayn/{bukhari,muslim}/{book}.json   one file per book, loaded by the reader
  - src/lib/sahihayn-index.json                          books, fiqh topics, qudsi references
  - data/sahihayn/search-{bukhari,muslim}.json           normalised text for the search API
Run: python3 scripts/build-sahihayn.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".cache")
TITLES = sys.argv[1] if len(sys.argv) > 1 else "/tmp/hj"

DIACRITICS = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭ‏‎]")


def norm(s: str) -> str:
    """Search form: no diacritics, unified alef/yeh/teh marbuta."""
    s = DIACRITICS.sub("", s)
    s = re.sub(r"[إأآٱ]", "ا", s).replace("ى", "ي").replace("ة", "ه")
    return re.sub(r"\s+", " ", s).strip()


def clean_title(t: str) -> str:
    t = DIACRITICS.sub("", t).strip()
    for a, b in [("الوحى", "الوحي"), ("الأضاحى", "الأضاحي"), ("المغازى", "المغازي"), ("التمنى", "التمني"), ("رضى الله تعالى عنهم", "رضي الله عنهم"), ("رضى الله", "رضي الله")]:
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t)


def split(text: str):
    """Isnad is everything before the first opening quote; the matn starts at it."""
    t = text.replace("‏", "").strip()
    m = re.search(r'"', t)
    if not m or m.start() < 15:
        return "", t
    return t[: m.start()].strip(" ،,:"), t[m.start():].strip()


W = r"(?![\u0621-\u064a])"  # word must end here ("الله" but not "اللهم")
QUDSI = re.compile(
    r"(?<![\u0621-\u064a])(قال|يقول|فيقول|يقول) (الله|ربكم|ربك|الرب|الجبار)" + W +
    r"( تبارك وتعالي| عز وجل| تعالي| جل وعز)?" + W + r"(?! ?[\"{﴿(])"
    r"|ان الله( تبارك وتعالي| عز وجل| تعالي)? (قال|يقول)" + W + r"(?! ?[\"{﴿(])"
)

# hadith of the day: only sayings that stand on their own (general rulings, virtues, counsel)
DAILY_OPENINGS = ("من ", "انما ", "ان الله", "المسلم", "المؤمن", "الدين", "كل ", "خيركم", "ما من ", "الطهور", "الكلمه", "اتق", "ليس ", "الحياء", "يسروا", "لا يؤمن", "لا يدخل", "لا تحاسدوا", "الدنيا", "البر ", "اتقوا", "احب ", "افضل", "الا اخبركم", "تبسمك", "ارحموا", "الراحمون")

# reviewed by hand: matches that quote the Quran or are not the Prophet reporting Allah's words
QUDSI_EXCLUDE = {("muslim", "684"), ("muslim", "799"), ("muslim", "136"), ("bukhari", "803"), ("bukhari", "4701")}

# fiqh chapters: each book of both collections is placed under one topic by its title
TOPICS = [
    ("aqeedah", "العقيدة والإيمان", ["الإيمان", "التوحيد", "القدر", "بدء الوحي", "الاعتصام", "المنافقين", "بدء الخلق"]),
    ("ilm", "العلم والقرآن", ["العلم", "التفسير", "فضائل القرآن", "أخبار الآحاد", "المقدمة"]),
    ("taharah", "الطهارة", ["الطهارة", "الوضوء", "الغسل", "الحيض", "التيمم"]),
    ("salah", "الصلاة", ["الصلاة", "مواقيت", "الأذان", "الجمعة", "الخوف", "العيدين", "الوتر", "الاستسقاء", "الكسوف", "سجود القرآن", "التقصير", "التهجد", "المساجد", "التطوع", "السهو", "العمل في الصلاة", "صلاة المسافرين", "مكة والمدينة"]),
    ("janaiz", "الجنائز", ["الجنائز"]),
    ("zakah", "الزكاة والصدقة", ["الزكاة", "الهبة", "الهبات", "الوصايا", "الوصية", "الوقف"]),
    ("siyam", "الصيام والاعتكاف", ["الصوم", "الصيام", "التراويح", "ليلة القدر", "الاعتكاف"]),
    ("hajj", "الحج والعمرة", ["الحج", "العمرة", "المحصر", "جزاء الصيد", "فضائل المدينة"]),
    ("muamalat", "البيوع والمعاملات", ["البيوع", "السلم", "الشفعة", "الإجارة", "الحوالات", "الكفالة", "الوكالة", "المزارعة", "المساقاة", "الاستقراض", "الخصومات", "اللقطة", "المظالم", "الشركة", "الرهن", "العتق", "المكاتب", "الشروط", "الفرائض", "الشهادات", "الصلح"]),
    ("nikah", "النكاح والأسرة", ["النكاح", "الطلاق", "الرضاع", "اللعان", "النفقات"]),
    ("atimah", "الأطعمة والأشربة واللباس", ["الأطعمة", "العقيقة", "الذبائح", "الصيد", "الأضاحي", "الأشربة", "اللباس", "الزينة"]),
    ("jihad", "الجهاد والسير", ["الجهاد", "فرض الخمس", "الجزية", "المغازي", "الإمارة", "الأحكام"]),
    ("hudud", "الحدود والقضاء", ["الحدود", "المحاربين", "الديات", "استتابة", "الإكراه", "الحيل", "الأقضية", "القسامة", "الأيمان والنذور", "كفارات الأيمان", "النذر", "الأيمان"]),
    ("adab", "الآداب والأخلاق", ["التمني", "الأدب", "الآداب", "الاستئذان", "السلام", "الألفاظ", "الشعر", "البر والصلة"]),
    ("dhikr", "الأذكار والدعاء", ["الدعوات", "الذكر والدعاء", "التوبة"]),
    ("tibb", "الطب والرؤى", ["المرضى", "الطب", "الرؤيا", "التعبير"]),
    ("raqaiq", "الرقاق والآخرة", ["الرقاق", "الزهد", "الجنة", "صفة القيامة", "الفتن", "أشراط الساعة"]),
    ("manaqib", "السيرة والمناقب", ["الأنبياء", "أحاديث الأنبياء", "المناقب", "فضائل", "مناقب الأنصار", "الفضائل"]),
]


def topic_for(title: str) -> str:
    best = None
    for tid, _, keys in TOPICS:
        for k in keys:
            if k in title and (best is None or len(k) > best[1]):
                best = (tid, len(k))
    return best[0] if best else "misc"


def build(coll: str, fz: str, arabic_name: str):
    f = json.load(open(os.path.join(CACHE, f"{fz}.json")))
    a = json.load(open(os.path.join(TITLES, f"{coll}.json")))
    secs, det, chapters = f["metadata"]["sections"], f["metadata"]["section_details"], a["chapters"]
    # Bukhari: the section ranges are reliable and some references say book 0, so ranges decide.
    # Muslim: two ranges in the metadata are wrong, so each hadith's own reference decides.
    ranges = [(int(k), int(v["hadithnumber_first"]), int(v["hadithnumber_last"])) for k, v in det.items() if secs.get(k) or coll == "muslim"]
    by_book = {}
    for h in sorted(f["hadiths"], key=lambda x: x["hadithnumber"]):
        if coll == "bukhari":
            book = next((k for k, a1, a2 in ranges if a1 <= h["hadithnumber"] <= a2 and k > 0), int(h["reference"]["book"]))
        else:
            book = int(h["reference"]["book"])
        by_book.setdefault(book, []).append(h)
    books, search, qudsi, daily = [], [], [], []
    out_dir = os.path.join(ROOT, "public", "data", "sahihayn", coll)
    os.makedirs(out_dir, exist_ok=True)
    keys = sorted((int(k) for k in secs if secs[k] or coll == "muslim"))
    for k in keys:
        d = det[str(k)]
        if coll == "bukhari":
            title = clean_title(chapters[k - 1]["arabic"])
        else:
            title = "المقدمة" if k == 0 else clean_title(chapters[k - 1]["arabic"])
        items = []
        # group by each hadith's own book reference: some section ranges in the source metadata are wrong
        for h in by_book.get(k, []):
            n = h["hadithnumber"]
            if not h.get("text", "").strip():
                continue
            isnad, matn = split(h["text"])
            num = h.get("arabicnumber", n)
            label = str(num).split(".")[0] if coll == "muslim" else str(int(float(num)))
            items.append({"id": n, "num": label, "isnad": isnad, "matn": matn})
            body = matn.strip(' "\u201c\u201d.')
            nb = norm(body)
            if isnad and 50 <= len(body) <= 200 and '"' not in body and nb.startswith(DAILY_OPENINGS):
                daily.append({"c": coll, "book": k, "id": n, "num": label, "matn": matn})
            search.append([n, k, label, norm(h["text"]), re.sub(r"\s+", " ", DIACRITICS.sub("", h["text"])).strip()])
            if QUDSI.search(norm(matn)) and isnad and (coll, label) not in QUDSI_EXCLUDE:
                qudsi.append({"c": coll, "book": k, "id": n, "num": label, "isnad": isnad, "matn": matn})
        if not items:
            continue
        json.dump(items, open(os.path.join(out_dir, f"{k}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
        books.append({"n": k, "title": title, "count": len(items), "first": items[0]["num"], "last": items[-1]["num"], "topic": topic_for(title)})
    os.makedirs(os.path.join(ROOT, "data", "sahihayn"), exist_ok=True)
    json.dump(search, open(os.path.join(ROOT, "data", "sahihayn", f"search-{coll}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    total = sum(b["count"] for b in books)
    return {"id": coll, "name": arabic_name, "author": a["metadata"]["arabic"]["author"], "total": total, "books": books}, qudsi, daily


def main():
    b, qb, db = build("bukhari", "ara-bukhari", "صحيح البخاري")
    m, qm, dm = build("muslim", "ara-muslim", "صحيح مسلم")
    # hadith of the day: short, complete sayings, spread across both collections
    pool = db + dm
    json.dump(pool, open(os.path.join(ROOT, "src", "lib", "daily-hadith.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print("daily pool", len(pool))
    topics = [{"id": t, "title": name} for t, name, _ in TOPICS] + [{"id": "misc", "title": "متفرقات"}]
    q_all = qb + qm
    json.dump(q_all, open(os.path.join(ROOT, "public", "data", "sahihayn", "qudsi.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    index = {"collections": [b, m], "topics": topics, "qudsiCount": len(q_all)}
    json.dump(index, open(os.path.join(ROOT, "src", "lib", "sahihayn-index.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    print("bukhari", b["total"], len(b["books"]), "muslim", m["total"], len(m["books"]), "qudsi", len(qb), len(qm))
    for c in (b, m):
        for bk in c["books"]:
            if bk["topic"] == "misc":
                print("  misc:", c["id"], bk["n"], bk["title"])


if __name__ == "__main__":
    main()
