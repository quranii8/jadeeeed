"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, Search, X } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./auth/UserMenu";
import { AppIcon } from "@/components/AppIcon";
import { StarMark } from "@/components/zellige/Rosette";
import { SkinSwitch, SKINS } from "./SkinSwitch";
import { useExtras } from "@/lib/extras-store";

export function Header() {
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glaze-field" style={{ boxShadow: "0 8px 24px -12px rgba(6,14,40,.6)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-5 py-2.5 flex items-center gap-3 md:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" style={{ color: "var(--on-field)" }}>
          <StarMark size={40} />
          <span className="leading-tight">
            <span className="block font-kufic font-bold text-[1.05rem] md:text-lg">منصة القرآن الكريم</span>
            <span className="hidden sm:block text-[11px] font-medium" style={{ color: "var(--on-field-muted)" }}>
              اقرأ، واستمع، وتدبّر
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 mr-auto">
          <NavLink href="/">الرئيسية</NavLink>
          <NavLink href="/surahs">السور</NavLink>
          <NavLink href="/tafsir">التفاسير</NavLink>
          <NavLink href="/reciters">القراء</NavLink>
          <NavGroup label="الختمة والحفظ" items={[
            { href: "/khatma", label: "ختمتي والورد اليومي" },
            { href: "/hifz", label: "الحفظ والتسميع" },
            { href: "/quran-search", label: "البحث في القرآن" },
          ]} />
          <NavGroup label="المحتوى" items={[
            { href: "/prophets", label: "قصص الأنبياء" },
            { href: "/quran-sciences", label: "علوم القرآن" },
            { href: "/tajweed", label: "أحكام التجويد" },
            { href: "/hadith-qudsi", label: "الأحاديث القدسية" },
            { href: "/hadith-nabawi", label: "صحيح البخاري ومسلم" },
          ]} />
          <NavGroup label="إسلاميات" items={[
            { href: "/adhkar", label: "الأذكار" },
            { href: "/asma-allah", label: "أسماء الله" },
            { href: "/prayer-times", label: "المواقيت" },
            { href: "/qibla", label: "القبلة" },
            { href: "/hijri", label: "التقويم الهجري" },
          ]} />
        </nav>

        {/* Spacer for tablet/mobile */}
        <div className="xl:hidden flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="icon-btn field-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
          {/* on phones the look controls live in the menu, under a labelled row, so the bar keeps only search and menu */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              className="icon-btn field-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
              title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <SkinSwitch compact />
          </div>
          <UserMenu />

          <button
            className="icon-btn field-btn xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="tile-strip" style={{ height: 8, backgroundSize: "32px 8px" }} />

      {/* Search bar (expanded) */}
      {searchOpen && (
        <div
          className="border-t animate-fade-in"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}
        >
          <div className="max-w-3xl mx-auto px-5 py-4">
            <SearchBar autoFocus onSelect={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="xl:hidden border-t animate-fade-in max-h-[80vh] overflow-y-auto"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}
        >
          <nav className="max-w-3xl mx-auto p-3 space-y-3">
            <MobileSection title="القرآن">
              <MobileNavLink href="/" onClose={() => setMobileOpen(false)} icon="home">الرئيسية</MobileNavLink>
              <MobileNavLink href="/surahs" onClose={() => setMobileOpen(false)} icon="book-open">السور</MobileNavLink>
              <MobileNavLink href="/tafsir" onClose={() => setMobileOpen(false)} icon="library">التفاسير</MobileNavLink>
              <MobileNavLink href="/reciters" onClose={() => setMobileOpen(false)} icon="mic">القراء</MobileNavLink>
              <MobileNavLink href="/khatma" onClose={() => setMobileOpen(false)} icon="target">ختمتي</MobileNavLink>
              <MobileNavLink href="/hifz" onClose={() => setMobileOpen(false)} icon="repeat">الحفظ والتسميع</MobileNavLink>
              <MobileNavLink href="/quran-search" onClose={() => setMobileOpen(false)} icon="search">البحث في القرآن</MobileNavLink>
            </MobileSection>

            <MobileSection title="المحتوى الإسلامي">
              <MobileNavLink href="/prophets" onClose={() => setMobileOpen(false)} icon="leaf">قصص الأنبياء</MobileNavLink>
              <MobileNavLink href="/quran-sciences" onClose={() => setMobileOpen(false)} icon="book-open">علوم القرآن</MobileNavLink>
              <MobileNavLink href="/tajweed" onClose={() => setMobileOpen(false)} icon="audio-waveform">أحكام التجويد</MobileNavLink>
              <MobileNavLink href="/hadith-qudsi" onClose={() => setMobileOpen(false)} icon="sparkles">الأحاديث القدسية</MobileNavLink>
              <MobileNavLink href="/hadith-nabawi" onClose={() => setMobileOpen(false)} icon="scroll-text">صحيح البخاري ومسلم</MobileNavLink>
            </MobileSection>

            <MobileSection title="أدوات إسلامية">
              <MobileNavLink href="/adhkar" onClose={() => setMobileOpen(false)} icon="hand-heart">الأذكار</MobileNavLink>
              <MobileNavLink href="/asma-allah" onClose={() => setMobileOpen(false)} icon="sparkles">أسماء الله</MobileNavLink>
              <MobileNavLink href="/prayer-times" onClose={() => setMobileOpen(false)} icon="mosque">المواقيت</MobileNavLink>
              <MobileNavLink href="/qibla" onClose={() => setMobileOpen(false)} icon="compass">القبلة</MobileNavLink>
              <MobileNavLink href="/hijri" onClose={() => setMobileOpen(false)} icon="moon-star">التقويم الهجري</MobileNavLink>
            </MobileSection>

            <AppearanceRow />

            <MobileSection title="حسابي">
              <MobileNavLink href="/dashboard" onClose={() => setMobileOpen(false)} icon="bar-chart">لوحة التحكم</MobileNavLink>
              <MobileNavLink href="/bookmarks" onClose={() => setMobileOpen(false)} icon="star">المحفوظات</MobileNavLink>
              <MobileNavLink href="/about" onClose={() => setMobileOpen(false)} icon="info">عن المنصة</MobileNavLink>
            </MobileSection>
          </nav>
        </div>
      )}
    </header>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} aria-current={isActive(pathname, href) ? "page" : undefined} className="field-link px-3 py-2 font-medium text-sm">
      {children}
    </Link>
  );
}

function NavGroup({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const current = items.some((i) => isActive(pathname, i.href));
  return (
    <div className="relative group">
      <button className="field-link px-3 py-2 font-medium text-sm" aria-haspopup="true" aria-current={current ? "page" : undefined}>
        {label}
      </button>
      <div className="absolute top-full right-0 mt-1 hidden group-hover:block group-focus-within:block min-w-[210px] py-2 rounded shadow-lg z-50"
           style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderTop: "3px solid var(--gold)" }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--primary-soft)] aria-[current=page]:font-bold"
            style={{ color: "var(--text)" }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold mb-1.5 px-2" style={{ color: "var(--gold-dark)" }}>
        {title}
      </div>
      <div className="grid grid-cols-2 gap-1">{children}</div>
    </div>
  );
}

function MobileNavLink({
  href,
  children,
  onClose,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
  icon: string;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className="min-h-11 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
      style={{ background: active ? "var(--primary-soft)" : "var(--bg-soft)", color: active ? "var(--primary)" : "var(--text)", boxShadow: active ? "inset 0 0 0 1px var(--primary)" : undefined }}
    >
      <span className="text-base" style={{ color: "var(--primary)" }}><AppIcon name={icon} /></span>
      {children}
    </Link>
  );
}

/** Theme and skin, labelled, for the phone menu. */
function AppearanceRow() {
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const skin = useExtras((s) => s.skin);
  const setSkin = useExtras((s) => s.setSkin);
  const chip = "min-h-11 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2";
  return (
    <MobileSection title="المظهر">
      <button type="button" onClick={toggleTheme} className={`${chip} col-span-2`} style={{ background: "var(--bg-soft)", color: "var(--text)" }}>
        {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
        {theme === "dark" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      </button>
      {SKINS.map((k) => (
        <button
          key={k.id}
          type="button"
          onClick={() => setSkin(k.id)}
          aria-pressed={skin === k.id}
          className={chip}
          style={{
            background: skin === k.id ? "var(--primary-soft)" : "var(--bg-soft)",
            color: skin === k.id ? "var(--primary)" : "var(--text)",
            boxShadow: skin === k.id ? "inset 0 0 0 1px var(--primary)" : undefined,
          }}
        >
          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: k.swatch[0], boxShadow: `inset 0 0 0 3px ${k.swatch[1]}` }} aria-hidden="true" />
          {k.label}
        </button>
      ))}
    </MobileSection>
  );
}
