import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Andalusian zellige glazes. Names kept for compatibility: primary = cobalt, gold = saffron.
        // the Rawdah. Names kept for compatibility: primary = royal green, gold = gold leaf, terracotta = silver.
        primary: {
          DEFAULT: "#0B4A37",
          dark: "#073326",
          light: "#13664C",
          50: "#EAF1ED",
          100: "#CFE0D7",
          500: "#13664C",
          600: "#0B4A37",
          700: "#073326",
        },
        gold: {
          DEFAULT: "#B8893A",
          light: "#D4AF5A",
          dark: "#7A5A1E",
          50: "#F8F1DF",
          100: "#EFDDB0",
        },
        emerald: { DEFAULT: "#2C6A55", light: "#3F8269", dark: "#1D4D3D" },
        terracotta: { DEFAULT: "#5F6E72", light: "#7D8B8F", dark: "#46524F" },
        silver: { DEFAULT: "#9AA5A8", light: "#D7DDDF" },
        ink: "#10241C",
        plaster: "#FAFAF7",
        cream: "#FAFAF7",
      },
      fontFamily: {
        quran: ["var(--font-amiri)", "Amiri", "Scheherazade New", "serif"],
        // Uthmani text from QuranEnc (prophet stories) needs the KFGQPC Hafs font
        kufic: ["var(--font-amiri)", "Amiri", "serif"],
        hafs: ["Hafs", "var(--font-amiri)", "Amiri", "serif"],
        arabic: ["var(--font-noto-kufi)", "Noto Kufi Arabic", "system-ui", "sans-serif"],
        naskh: ["var(--font-noto-naskh)", "Noto Naskh Arabic", "serif"],
        en: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      // marble arches and soft-cut panels
      borderRadius: {
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
