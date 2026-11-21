"use client";

import { useState } from "react";
import { getReciterAvatar } from "@/lib/reciter-avatars";

interface Props {
  name: string;
  imageUrl?: string;
  size?: number;
  className?: string;
  /** إظهار حلقة ذهبية حول الصورة */
  ring?: boolean;
}

/**
 * مكوّن avatar ذكي للقارئ:
 * - يحاول تحميل الصورة الحقيقية أولاً
 * - عند الفشل (404 / CORS) يعرض SVG avatar أنيق بألوان مميّزة
 * - يدعم حلقة زخرفية اختيارية
 */
export function ReciterAvatar({ name, imageUrl, size = 64, className = "", ring = false }: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fallbackSvg = getReciterAvatar(name, size);
  const src = !imageUrl || errored ? fallbackSvg : imageUrl;

  const ringStyle = ring
    ? {
        padding: "3px",
        background: "linear-gradient(135deg, var(--gold), var(--primary))",
        borderRadius: "50%",
      }
    : {};

  return (
    <div style={ringStyle} className={ring ? "" : ""}>
      <div
        className={`rounded-full overflow-hidden bg-gradient-to-br relative ${className}`}
        style={{
          width: size,
          height: size,
          background: "var(--bg-soft)",
        }}
      >
        {/* the drawn avatar shows until a photo actually arrives */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fallbackSvg} alt="" aria-hidden="true" width={size} height={size} className="absolute inset-0 w-full h-full" />
        {src !== fallbackSvg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            width={size}
            height={size}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className="relative w-full h-full object-cover transition-opacity duration-500"
            style={{ display: "block", opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
}
