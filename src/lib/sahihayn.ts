import index from "./sahihayn-index.json";

export type CollectionId = "bukhari" | "muslim";
export type Book = { n: number; title: string; count: number; first: string; last: string; topic: string };
export type Collection = { id: CollectionId; name: string; author: string; total: number; books: Book[] };
export type Topic = { id: string; title: string };
/** one hadith as stored in public/data/sahihayn/{collection}/{book}.json */
export type Hadith = { id: number; num: string; isnad: string; matn: string };
export type QudsiHadith = Hadith & { c: CollectionId; book: number };

export const COLLECTIONS = index.collections as Collection[];
export const TOPICS = index.topics as Topic[];
export const QUDSI_COUNT = index.qudsiCount as number;
export const SAHIHAYN_TOTAL = COLLECTIONS.reduce((n, c) => n + c.total, 0);

export function getCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getBook(c: string, n: number): { collection: Collection; book: Book } | undefined {
  const collection = getCollection(c);
  const book = collection?.books.find((b) => b.n === n);
  return collection && book ? { collection, book } : undefined;
}

export function booksForTopic(topic: string) {
  return COLLECTIONS.map((c) => ({ collection: c, books: c.books.filter((b) => b.topic === topic) }));
}

export const COLLECTION_GLAZE: Record<CollectionId, string> = { bukhari: "var(--g-cobalt)", muslim: "var(--g-emerald)" };

const TOPIC_GLAZES = ["var(--g-cobalt)", "var(--g-emerald)", "var(--g-terracotta)", "var(--g-ink)", "var(--g-saffron-deep)"];
export function topicGlaze(i: number) {
  return TOPIC_GLAZES[i % TOPIC_GLAZES.length];
}

/** short book title without the leading "كتاب" for compact tiles */
export function shortTitle(t: string) {
  return t.replace(/^كتاب\s+/, "");
}
