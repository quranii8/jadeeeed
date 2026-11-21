import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync } from "fs";
import path from "path";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { COLLECTIONS, getBook, type Hadith } from "@/lib/sahihayn";
import { BookReader } from "@/components/hadith/BookReader";
import { toArabicNum } from "@/lib/utils";

export function generateStaticParams() {
  return COLLECTIONS.flatMap((c) => c.books.map((b) => ({ collection: c.id, book: String(b.n) })));
}

export function generateMetadata({ params }: { params: { collection: string; book: string } }): Metadata {
  const r = getBook(params.collection, Number(params.book));
  return r ? { title: `${r.book.title} من ${r.collection.name}`, description: `${r.book.count} حديثاً من ${r.book.title} في ${r.collection.name}.` } : {};
}

export default function BookPage({ params }: { params: { collection: string; book: string } }) {
  const r = getBook(params.collection, Number(params.book));
  if (!r) notFound();
  const { collection: c, book: b } = r;
  const file = path.join(process.cwd(), "public", "data", "sahihayn", c.id, `${b.n}.json`);
  const initial = (JSON.parse(readFileSync(file, "utf8")) as Hadith[]).slice(0, 30);
  const i = c.books.findIndex((x) => x.n === b.n);
  const prev = c.books[i - 1];
  const next = c.books[i + 1];

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-5 py-8">
      <Link href={`/hadith-nabawi/${c.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "var(--primary)" }}>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
        {c.name}
      </Link>
      <header className={`page-band ${c.id === "bukhari" ? "page-band--cobalt" : "page-band--emerald"} text-center relative overflow-hidden mb-6`}>
        <p className="text-sm mb-1" style={{ color: "#DCE4F6" }}>{c.name}</p>
        <h1 className="text-3xl md:text-5xl leading-tight">{b.title}</h1>
        <p className="mt-3 text-sm" style={{ color: "#DCE4F6" }}>
          {toArabicNum(b.count)} حديثاً، من رقم {toArabicNum(b.first)} إلى {toArabicNum(b.last)}
        </p>
      </header>

      <BookReader src={`/data/sahihayn/${c.id}/${b.n}.json`} initial={initial} total={b.count} collectionName={c.name} bookTitle={b.title} origin={{ c: c.id, book: b.n }} />

      <nav className="mt-10 grid grid-cols-2 gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }} aria-label="الكتب المجاورة">
        {next ? (
          <Link href={`/hadith-nabawi/${c.id}/${next.n}`} className="plaster-tile glaze p-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0"><span className="block text-xs" style={{ color: "var(--text-muted)" }}>التالي</span><span className="block font-bold truncate">{next.title}</span></span>
          </Link>
        ) : <span />}
        {prev ? (
          <Link href={`/hadith-nabawi/${c.id}/${prev.n}`} className="plaster-tile glaze p-4 flex items-center gap-2 justify-end text-left">
            <span className="min-w-0"><span className="block text-xs" style={{ color: "var(--text-muted)" }}>السابق</span><span className="block font-bold truncate">{prev.title}</span></span>
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
        ) : <span />}
      </nav>
    </section>
  );
}
