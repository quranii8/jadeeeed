export const metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام منصة القرآن الكريم",
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 py-12 leading-loose">
      <h1 className="font-display text-3xl md:text-4xl mb-8">شروط الاستخدام</h1>
      <div className="plaster-tile p-6 md:p-8 space-y-6">
        <p>منصة القرآن الكريم مشروع مجاني لخدمة كتاب الله، ويحق لكل أحد استعمالها للقراءة والتعلّم.</p>
        <p>نص القرآن الكريم مأخوذ من مصادر موثوقة بالرسم العثماني، والأحاديث من صحيحي البخاري ومسلم مع أرقامها. إن وجدت خطأً فنرجو إبلاغنا لتصحيحه.</p>
        <p>لا يجوز استعمال المنصة في ما يسيء إلى القرآن الكريم أو السنة النبوية، ولا محاولة الإضرار بها أو بمستخدميها.</p>
        <p>تسجيل الدخول اختياري، وتنطبق عليه <a href="/privacy" className="underline">سياسة الخصوصية</a>.</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>آخر تحديث: نوفمبر ٢٠٢٦</p>
      </div>
    </article>
  );
}
