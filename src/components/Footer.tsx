import Link from "next/link";
import { StarMark } from "@/components/zellige/Rosette";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 glaze-field">
      <div className="tile-strip" />
      <div className="zellige-lattice absolute inset-0 top-[14px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 pt-12 pb-28">
        <div className="flex items-center gap-3 mb-10">
          <StarMark size={48} />
          <div>
            <div className="font-kufic font-bold text-2xl" style={{ color: "var(--on-field)" }}>منصة القرآن الكريم</div>
            <div className="text-sm" style={{ color: "var(--on-field-muted)" }}>اقرأ، واستمع، وتدبّر</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
          <FooterColumn title="القرآن">
            <FooterLink href="/surahs">السور</FooterLink>
            <FooterLink href="/tafsir">التفاسير</FooterLink>
            <FooterLink href="/reciters">القراء</FooterLink>
            <FooterLink href="/khatma">ختمتي</FooterLink>
            <FooterLink href="/hifz">الحفظ والتسميع</FooterLink>
            <FooterLink href="/quran-search">البحث في القرآن</FooterLink>
            <FooterLink href="/bookmarks">المحفوظات</FooterLink>
          </FooterColumn>

          <FooterColumn title="المحتوى">
            <FooterLink href="/prophets">قصص الأنبياء</FooterLink>
            <FooterLink href="/quran-sciences">علوم القرآن</FooterLink>
            <FooterLink href="/tajweed">أحكام التجويد</FooterLink>
            <FooterLink href="/hadith-nabawi">صحيح البخاري ومسلم</FooterLink>
            <FooterLink href="/hadith-qudsi">الأحاديث القدسية</FooterLink>
          </FooterColumn>

          <FooterColumn title="إسلاميات">
            <FooterLink href="/adhkar">الأذكار</FooterLink>
            <FooterLink href="/asma-allah">أسماء الله</FooterLink>
            <FooterLink href="/prayer-times">المواقيت</FooterLink>
            <FooterLink href="/qibla">القبلة</FooterLink>
            <FooterLink href="/hijri">التقويم الهجري</FooterLink>
          </FooterColumn>

          <FooterColumn title="حسابي">
            <FooterLink href="/dashboard">لوحة التحكم</FooterLink>
            <FooterLink href="/auth/signin">تسجيل الدخول</FooterLink>
            <FooterLink href="/about">عن المنصة</FooterLink>
          </FooterColumn>
        </div>

        <div className="text-center pt-6 border-t" style={{ borderColor: "rgba(238,241,236,.2)" }}>
          <p className="text-sm" style={{ color: "var(--on-field-muted)" }}>
            صُنع بحب لخدمة كتاب الله تعالى · © {new Date().getFullYear()}
          </p>
          <p className="mt-1.5 text-xs" style={{ color: "var(--on-field-muted)", opacity: .8 }}>
            المصادر: api.alquran.cloud • mp3quran.net • everyayah.com • aladhan.com
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-kufic font-bold mb-3 text-base" style={{ color: "var(--gold-light)" }}>{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm transition-colors hover:underline hover:text-white"
      style={{ color: "var(--on-field-muted)" }}
    >
      {children}
    </Link>
  );
}
