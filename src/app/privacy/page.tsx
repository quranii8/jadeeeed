export const metadata = {
  title: "سياسة الخصوصية",
  description: "كيف تتعامل منصة القرآن الكريم مع بياناتك",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 py-12 leading-loose">
      <h1 className="font-display text-3xl md:text-4xl mb-8">سياسة الخصوصية</h1>
      <div className="plaster-tile p-6 md:p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-2">ما الذي نجمعه</h2>
          <p>
            عند تسجيل الدخول بحساب Google نحفظ اسمك وبريدك الإلكتروني وصورة حسابك فقط، لربط تقدّمك بحسابك.
            ونحفظ ما تختاره أنت داخل المنصة: العلامات، وآخر موضع قراءة، والختمة، والأحاديث المحفوظة.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">لماذا نجمعه</h2>
          <p>لنُبقي تقدّمك محفوظاً وتجده على كل أجهزتك. لا نستعمل بياناتك لأي غرض آخر، ولا نبيعها ولا نشاركها مع أحد.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">الإحصاءات</h2>
          <p>نستعمل إحصاءات Vercel لمعرفة عدد الزيارات بشكل عام، وهي لا تستعمل ملفات تعريف الارتباط ولا تحدد هوية الزائر.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">حذف بياناتك</h2>
          <p>يمكنك طلب حذف حسابك وكل ما يتعلق به في أي وقت، وتُحذف البيانات نهائياً من قاعدة البيانات.</p>
        </section>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>آخر تحديث: نوفمبر ٢٠٢٦</p>
      </div>
    </article>
  );
}
