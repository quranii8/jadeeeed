"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

const cache = new Map<number, string[]>();
async function surahText(s: number) {
  if (!cache.has(s)) cache.set(s, await (await fetch(`/data/quran/${s}.json`)).json());
  return cache.get(s)!;
}

/** The ayat in which a name's wording occurs, read from the site's own copy of the Mushaf. */
export function NameInQuran({ refs }: { refs: [number, number][] }) {
  const [shown, setShown] = useState(6);
  const [texts, setTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const next: Record<string, string> = {};
      for (const [s, a] of refs.slice(0, shown)) {
        try {
          next[`${s}:${a}`] = (await surahText(s))[a - 1];
        } catch {
          /* offline: the reference link still works */
        }
      }
      if (alive) setTexts((t) => ({ ...t, ...next }));
    })();
    return () => {
      alive = false;
    };
  }, [refs, shown]);

  if (!refs.length)
    return (
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        لم يرد هذا الاسم بلفظه في القرآن، وإنما ورد بمعناه أو بصيغة الفعل، أو ثبت في السنة.
      </p>
    );

  return (
    <div>
      <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
        ورد لفظه في {toArabicNum(refs.length)} {refs.length > 10 ? "آية" : "آيات"}. يُعدّ اللفظ حيث ورد، معرّفاً أو منكّراً، وقد يأتي في بعضها بمعنى غير الاسم.
      </p>
      <ul className="space-y-2">
        {refs.slice(0, shown).map(([s, a]) => (
          <li key={`${s}:${a}`} className="plaster-tile p-3">
            <Link href={`/surah/${s}#verse-${a}`} className="block">
              <span className="block text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>
                سورة {getSurah(s)?.a}، الآية {toArabicNum(a)}
              </span>
              <span className="block font-hafs text-lg leading-loose">{texts[`${s}:${a}`] ?? "…"}</span>
            </Link>
          </li>
        ))}
      </ul>
      {shown < refs.length && (
        <button type="button" onClick={() => setShown((n) => n + 10)} className="btn btn-outline mt-3 !py-2 text-sm">
          آيات أخرى ({toArabicNum(refs.length - shown)})
        </button>
      )}
    </div>
  );
}
