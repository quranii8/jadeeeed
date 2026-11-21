"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, Search, X } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./auth/UserMenu";
import { AppIcon } from "@/components/AppIcon";
import { StarMark } from "@/components/zellige/Rosette";

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
          <NavGroup label="المحتوى" items={[
            { href: "/prophets", label: "قصص الأنبياء" },
            { href: "/quran-sciences", label: "علوم القرآن" },
            { href: "/tajweed", label: "أحكام التجويد" },
            { href: "/hadith-qudsi", label: "الأحاديث القدسية" },
            { href: "/hadith-nabawi", label: "الأحاديث النبوية" },
          ]} />
          <NavGroup label="إسلاميات" items={[
            { href: "/adhkar", label: "الأذكار" },
            { href: "/asma-allah", label: "أسماء الله" },
            { href: "/prayer-times", label: "المواقيت" },
            { href: "/qibla", label: "القبلة" },
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
          <button
            className="icon-btn field-btn"
            onClick={toggleTheme}
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

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
            </MobileSection>

            <MobileSection title="المحتوى الإسلامي">
              <MobileNavLink href="/prophets" onClose={() => setMobileOpen(false)} icon="leaf">قصص الأنبياء</MobileNavLink>
              <MobileNavLink href="/quran-sciences" onClose={() => setMobileOpen(false)} icon="book-open">علوم القرآن</MobileNavLink>
              <MobileNavLink href="/tajweed" onClose={() => setMobileOpen(false)} icon="audio-waveform">أحكام التجويد</MobileNavLink>
              <MobileNavLink href="/hadith-qudsi" onClose={() => setMobileOpen(false)} icon="sparkles">الأحاديث القدسية</MobileNavLink>
              <MobileNavLink href="/hadith-nabawi" onClose={() => setMobileOpen(false)} icon="scroll-text">الأحاديث النبوية</MobileNavLink>
            </MobileSection>

            <MobileSection title="أدوات إسلامية">
              <MobileNavLink href="/adhkar" onClose={() => setMobileOpen(false)} icon="hand-heart">الأذكار</MobileNavLink>
              <MobileNavLink href="/asma-allah" onClose={() => setMobileOpen(false)} icon="sparkles">أسماء الله</MobileNavLink>
              <MobileNavLink href="/prayer-times" onClose={() => setMobileOpen(false)} icon="mosque">المواقيت</MobileNavLink>
              <MobileNavLink href="/qibla" onClose={() => setMobileOpen(false)} icon="compass">القبلة</MobileNavLink>
            </MobileSection>

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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="field-link px-3 py-2 font-medium text-sm">
      {children}
    </Link>
  );
}

function NavGroup({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  return (
    <div className="relative group">
      <button className="field-link px-3 py-2 font-medium text-sm" aria-haspopup="true">
        {label}
      </button>
      <div className="absolute top-full right-0 mt-1 hidden group-hover:block group-focus-within:block min-w-[210px] py-2 rounded shadow-lg z-50"
           style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderTop: "3px solid var(--gold)" }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--primary-soft)]"
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
  return (
    <Link
      href={href}
      onClick={onClose}
      className="px-3 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
      style={{ background: "var(--bg-soft)", color: "var(--text)" }}
    >
      <span className="text-base" style={{ color: "var(--primary)" }}><AppIcon name={icon} /></span>
      {children}
    </Link>
  );
}
