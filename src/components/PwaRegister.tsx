"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/** Registers the offline worker, and on iPhone/iPad shows once how to add the site to the home screen. */
export function PwaRegister() {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    let seen = false;
    try {
      seen = localStorage.getItem("install-hint") === "1";
    } catch {
      /* storage blocked */
    }
    if (ios && !standalone && !seen) {
      const t = setTimeout(() => setHint(true), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!hint) return null;
  const close = () => {
    setHint(false);
    try {
      localStorage.setItem("install-hint", "1");
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-24 z-[60] md:inset-x-auto md:left-6 md:w-96 rise-in" role="dialog" aria-label="ثبّت المنصة على جهازك">
      <div className="glaze-field p-4 pe-10 rounded relative" style={{ boxShadow: "var(--shadow-lg)" }}>
        <button type="button" onClick={close} className="absolute top-2 left-2 icon-btn field-btn !w-8 !h-8" aria-label="إغلاق">
          <X className="w-4 h-4" />
        </button>
        <div className="font-kufic font-bold text-lg">ثبّت المنصة على شاشتك</div>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--on-field-muted)" }}>
          اضغط زر المشاركة في المتصفح، ثم «إضافة إلى الشاشة الرئيسية». تفتح كتطبيق، وتعمل الصفحات التي زرتها بدون إنترنت.
        </p>
      </div>
      <div className="tile-strip" style={{ height: 8, backgroundSize: "32px 8px" }} />
    </div>
  );
}
