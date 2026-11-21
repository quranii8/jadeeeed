import type { Metadata, Viewport } from "next";
import { Amiri, Noto_Kufi_Arabic, Noto_Naskh_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeApplier } from "@/components/ThemeApplier";
import { PwaRegister } from "@/components/PwaRegister";
import { SessionProvider } from "@/components/auth/SessionProvider";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-kufi",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "منصة القرآن الكريم — اقرأ • استمع • تدبّر",
    template: "%s | منصة القرآن الكريم",
  },
  description:
    "منصة إسلامية متكاملة للقرآن الكريم: قراءة بالخط العثماني، استماع لأشهر القراء، 8 تفاسير معتمدة، أذكار، أسماء الله الحسنى، مواقيت الصلاة، اتجاه القبلة، قصص الأنبياء، وعلوم القرآن.",
  keywords: ["القرآن الكريم", "تفسير", "أذكار", "أسماء الله", "قصص الأنبياء", "علوم القرآن", "مواقيت الصلاة", "Quran"],
  openGraph: {
    title: "منصة القرآن الكريم",
    description: "رحلتك مع كتاب الله تبدأ هنا",
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "القرآن", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "var(--g-cobalt)" },
    { media: "(prefers-color-scheme: dark)", color: "#12245C" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${notoKufi.variable} ${notoNaskh.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* apply the saved skin and light/dark before the first paint, so the page never flashes the wrong colours */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var e=JSON.parse(localStorage.getItem("quran-platform-extras")||"{}").state||{};if(e.skin)document.documentElement.dataset.skin=e.skin;var q=JSON.parse(localStorage.getItem("quran-platform-store")||"{}").state||{};if(q.theme==="dark")document.documentElement.classList.add("dark")}catch(_){}`,
          }}
        />
      </head>
      <body>
        <SessionProvider>
          <ThemeApplier />
          <Header />
          <main className="relative z-10 pb-16">{children}</main>
          <Footer />
          <AudioPlayer />
          <PwaRegister />
        </SessionProvider>
      </body>
    </html>
  );
}
