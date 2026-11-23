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
      <header className="page-band page-band--cobalt text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">آياتك المحفوظة</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          كل الآيات التي حفظتها — اضغط على أي آية للذهاب إليها في السورة.
        </p>
      </header>
      <BookmarksList />

      <div className="flex items-center gap-3 mt-12 mb-4">
        <HeadingStar />
        <h2 className="text-2xl md:text-3xl font-extrabold">أحاديثك المحفوظة</h2>
      </div>
      <SavedHadiths />
    </section>
  );
}
