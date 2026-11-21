import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "fs";
import path from "path";
import { QUDSI_COUNT, type QudsiHadith } from "@/lib/sahihayn";
import { BookReader } from "@/components/hadith/BookReader";
import { toArabicNum } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الأحاديث القدسية من الصحيحين",
  description: "الأحاديث التي يرويها النبي ﷺ عن ربه عز وجل، من صحيح البخاري وصحيح مسلم بنصها الكامل.",
};

export default function HadithQudsiPage() {
  const all = JSON.parse(readFileSync(path.join(process.cwd(), "public", "data", "sahihayn", "qudsi.json"), "utf8")) as QudsiHadith[];
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-5 py-8">
      <header className="page-band page-band--ink text-center relative overflow-hidden mb-6">
        <h1 className="text-3xl md:text-5xl mb-3">الأحاديث القدسية</h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#D5DCEB" }}>
          ما يرويه النبي ﷺ عن ربه عز وجل، مجموعاً من صحيح البخاري وصحيح مسلم بنصه الكامل وسنده.
        </p>
        <div className="mt-4 inline-flex gap-2 text-sm">
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(QUDSI_COUNT)} حديثاً</span>
        </div>
      </header>
      <p className="plaster-tile p-4 mb-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        جُمعت هذه الأحاديث بالبحث في نصوص الصحيحين عن قول النبي ﷺ «قال الله» و«يقول الله» وما في معناها، ثم رُوجعت. وكل حديث يفتح في موضعه من كتابه في{" "}
        <Link href="/hadith-nabawi" className="font-semibold underline" style={{ color: "var(--primary)" }}>الصحيحين</Link>.
      </p>
      <BookReader src="/data/sahihayn/qudsi.json" initial={all.slice(0, 30)} total={QUDSI_COUNT} collectionName="" noun="قدسياً من الصحيحين" />
    </section>
  );
}
