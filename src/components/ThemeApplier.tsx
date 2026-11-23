"use client";

import { useEffect } from "react";
import { useQuranStore } from "@/lib/store";
import { useExtras } from "@/lib/extras-store";

/** يطبّق الثيم على <html> بعد hydration */
export function ThemeApplier() {
  const theme = useQuranStore((s) => s.theme);
  const skin = useExtras((s) => s.skin);

  useEffect(() => {
    document.documentElement.dataset.skin = skin;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", skin === "kiswah" ? "#121214" : skin === "andalus" ? "#1B3A8C" : "#070B1E");
  }, [skin]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
