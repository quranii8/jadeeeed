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
        primary: {
          DEFAULT: "#1B3A8C",
          dark: "#10275F",
          light: "#2D54B8",
          50: "#E6ECF8",
          100: "#C9D5F0",
          500: "#2D54B8",
          600: "#1B3A8C",
          700: "#10275F",
        },
        gold: {
          DEFAULT: "#D99A1E",
          light: "#F0BE52",
          dark: "#8F5D07",
          50: "#FBF1DA",
          100: "#F6DFA9",
        },
        emerald: { DEFAULT: "#0E6B5A", light: "#1C8C76", dark: "#084A3E" },
        terracotta: { DEFAULT: "#B4472F", light: "#CF6247", dark: "#8A3220" },
        ink: "#0E1630",
        plaster: "#EEF1EC",
        cream: "#EEF1EC",
      },
      fontFamily: {
        quran: ["var(--font-amiri)", "Amiri", "Scheherazade New", "serif"],
        // Uthmani text from QuranEnc (prophet stories) needs the KFGQPC Hafs font
        kufic: ["ReemKufi", "var(--font-noto-kufi)", "sans-serif"],
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
      // zellige tiles have square shoulders: the whole radius scale is tightened
      borderRadius: {
        lg: "5px",
        xl: "6px",
        "2xl": "8px",
        "3xl": "10px",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
