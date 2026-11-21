import { BookmarksList } from "@/components/BookmarksList";
import { HeadingStar } from "@/components/zellige/Rosette";
import { SavedHadiths } from "@/components/hadith/SavedHadiths";

export const metadata = {
  title: "المحفوظات",
  description: "الآيات والأحاديث التي حفظتها",
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

      <div className="flex items-center gap-3 mt-12 mb-4">
        <HeadingStar />
        <h2 className="text-2xl md:text-3xl font-extrabold">أحاديثك المحفوظة</h2>
      </div>
      <SavedHadiths />
    </section>
  );
}
