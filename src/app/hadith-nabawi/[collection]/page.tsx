import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, getCollection, TOPICS } from "@/lib/sahihayn";
import { SahihaynSearch } from "@/components/hadith/SahihaynSearch";
import { toArabicNum } from "@/lib/utils";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.id }));
}

export function generateMetadata({ params }: { params: { collection: string } }): Metadata {
  const c = getCollection(params.collection);
  return c ? { title: `${c.name} كاملاً`, description: `كتب ${c.name} كلها، ${c.total} حديثاً بنصها العربي.` } : {};
}

export default function CollectionPage({ params }: { params: { collection: string } }) {
  const c = getCollection(params.collection);
  if (!c) notFound();
  const topicTitle = (id: string) => TOPICS.find((t) => t.id === id)?.title ?? "";
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <Link href="/hadith-nabawi" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "var(--primary)" }}>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
        الصحيحان
      </Link>
      <header className={`page-band ${c.id === "bukhari" ? "page-band--cobalt" : "page-band--emerald"} text-center relative overflow-hidden mb-8`}>
        <h1 className="text-4xl md:text-6xl mb-2">{c.name}</h1>
        <p className="text-base" style={{ color: "#DCE4F6" }}>{c.author}</p>
        <div className="mt-4 inline-flex gap-2 text-sm">
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(c.total)} حديثاً</span>
          <span className="px-3 py-1 rounded bg-white/15">{toArabicNum(c.books.length)} كتاباً</span>
        </div>
      </header>

      <SahihaynSearch collection={c.id} />

      <h2 className="font-kufic font-bold text-3xl mt-10 mb-4">الكتب</h2>
      <ol className="tile-wall grid sm:grid-cols-2 lg:grid-cols-3 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
        {c.books.map((b, i) => (
          <li key={b.n} className="contents">
            <Link href={`/hadith-nabawi/${c.id}/${b.n}`} className="plaster-tile glaze p-4 flex items-start gap-3">
              <span className="w-9 h-9 grid place-items-center shrink-0 text-sm font-bold rounded" style={{ background: c.id === "bukhari" ? "#1B3A8C" : "#0E6B5A", color: "#F4F6FB" }}>
                {toArabicNum(i + 1)}
              </span>
              <span className="min-w-0">
                <span className="block font-bold leading-snug">{b.title}</span>
                <span className="block mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {toArabicNum(b.count)} حديثاً · من {toArabicNum(b.first)} إلى {toArabicNum(b.last)} · {topicTitle(b.topic)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
