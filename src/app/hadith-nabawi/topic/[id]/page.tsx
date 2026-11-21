import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TOPICS, booksForTopic } from "@/lib/sahihayn";
import { toArabicNum } from "@/lib/utils";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const t = TOPICS.find((x) => x.id === params.id);
  return t ? { title: `${t.title} في الصحيحين` } : {};
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const t = TOPICS.find((x) => x.id === params.id);
  if (!t) notFound();
  const groups = booksForTopic(t.id).filter((g) => g.books.length);
  const total = groups.reduce((n, g) => n + g.books.reduce((m, b) => m + b.count, 0), 0);
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-5 py-8">
      <Link href="/hadith-nabawi" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "var(--primary)" }}>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
        الصحيحان
      </Link>
      <header className="page-band page-band--terracotta text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-2">{t.title}</h1>
        <p className="text-sm" style={{ color: "#F7DCD4" }}>{toArabicNum(total)} حديثاً من البخاري ومسلم</p>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        {groups.map((g) => (
          <div key={g.collection.id}>
            <h2 className="font-kufic font-bold text-2xl mb-3">{g.collection.name}</h2>
            <ul className="tile-wall grid gap-[5px] p-[5px]" style={{ background: "var(--grout-wall)" }}>
              {g.books.map((b) => (
                <li key={b.n} className="contents">
                  <Link href={`/hadith-nabawi/${g.collection.id}/${b.n}`} className="plaster-tile glaze p-4 flex items-center justify-between gap-3">
                    <span className="font-bold">{b.title}</span>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{toArabicNum(b.count)} حديثاً</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
