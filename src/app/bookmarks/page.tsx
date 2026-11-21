import { BookmarksList } from "@/components/BookmarksList";
import { HeadingStar } from "@/components/zellige/Rosette";

export const metadata = {
  title: "المحفوظات",
  description: "آياتك المفضلة المحفوظة",
};

export default function BookmarksPage() {
  return (
    <section className="max-w-5xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <HeadingStar />
        <h1 className="text-2xl md:text-3xl font-extrabold">آياتك المحفوظة</h1>
      </div>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        كل الآيات التي حفظتها — اضغط على أي آية للذهاب إليها في السورة.
      </p>
      <BookmarksList />
    </section>
  );
}
