/**
 * يعرض نص القصة: يقسمه إلى فقرات، ويحوّل الآيات المعلَّمة
 * بـ <span class="quran-verse">...</span> إلى كتلة آية منسّقة بدل ظهور الوسم كنص.
 */
const VERSE_RE = /<span class="quran-verse">([\s\S]*?)<\/span>/g;

export function StoryText({ text, className = "" }: { text: string; className?: string }) {
  const blocks: Array<{ kind: "p" | "verse"; text: string }> = [];
  let last = 0;
  for (const m of text.matchAll(VERSE_RE)) {
    const before = text.slice(last, m.index);
    before.split(/\n\s*\n/).forEach((p) => p.trim() && blocks.push({ kind: "p", text: p.trim() }));
    blocks.push({ kind: "verse", text: m[1].trim() });
    last = (m.index ?? 0) + m[0].length;
  }
  text
    .slice(last)
    .split(/\n\s*\n/)
    .forEach((p) => p.trim() && blocks.push({ kind: "p", text: p.trim() }));

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((b, i) =>
        b.kind === "verse" ? (
          <p
            key={i}
            className="font-hafs text-xl md:text-2xl leading-loose text-center px-4 py-3 rounded-xl"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
          >
            ﴿{b.text.replace(/\s*\*\s*/g, " ۝ ")}﴾
          </p>
        ) : (
          <p key={i} className="leading-loose">
            {b.text}
          </p>
        )
      )}
    </div>
  );
}
