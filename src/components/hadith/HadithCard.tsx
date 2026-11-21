"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, Share2 } from "lucide-react";
import { TileStar } from "@/components/zellige/Rosette";
import { SpeakButton } from "./SpeakButton";
import { toArabicNum } from "@/lib/utils";
import type { Hadith } from "@/lib/sahihayn";

/**
 * One hadith as a plaster tile: number in a star, the chain of narration folded
 * away by default, the matn set large in Amiri. Text is shown exactly as stored.
 */
export function HadithCard({
  h,
  collectionName,
  bookTitle,
  href,
}: {
  h: Hadith;
  collectionName: string;
  bookTitle?: string;
  href?: string;
}) {
  const [showIsnad, setShowIsnad] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = `${collectionName}، رقم ${toArabicNum(h.num)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${h.isnad ? h.isnad + " " : ""}${h.matn}\n\n${ref}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard can be blocked; nothing else to do */
    }
  };

  const share = async () => {
    const url = href ? new URL(href, window.location.origin).toString() : window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: ref, text: `${h.matn}\n\n${ref}`, url });
      } catch {
        /* the visitor closed the share sheet */
      }
    } else {
      copy();
    }
  };

  return (
    <article id={`h-${h.id}`} className="plaster-tile hadith-tile p-5 md:p-7 scroll-mt-28">
      <header className="flex items-center gap-3 mb-4">
        <span className="relative w-12 h-12 grid place-items-center shrink-0">
          <TileStar color="var(--primary)" size={48} className="absolute inset-0" />
          <span className="relative text-[13px] font-bold" style={{ color: "var(--primary)" }}>
            {toArabicNum(h.num)}
          </span>
        </span>
        <div className="min-w-0">
          <div className="font-kufic font-bold text-base leading-tight">{collectionName}</div>
          {bookTitle && (
            <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {bookTitle}
            </div>
          )}
        </div>
      </header>

      {h.isnad && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowIsnad((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: "var(--gold-dark)" }}
            aria-expanded={showIsnad}
          >
            السند
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showIsnad ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          {showIsnad && (
            <p className="font-naskh mt-2 text-sm leading-[2.1]" style={{ color: "var(--text-muted)" }}>
              {h.isnad}
            </p>
          )}
        </div>
      )}

      <p className="font-quran text-[1.35rem] md:text-[1.6rem] leading-[2.15]" style={{ color: "var(--text)" }}>
        {h.matn}
      </p>

      <footer className="mt-5 pt-4 flex flex-wrap items-center gap-2" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <SpeakButton id={`h-${h.id}`} text={h.matn} />
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded"
          style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
        >
          {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          {copied ? "نُسخ" : "نسخ"}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded"
          style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          مشاركة
        </button>
        <span className="ms-auto text-xs font-semibold" style={{ color: "var(--text-soft)" }}>
          {ref}
        </span>
      </footer>
    </article>
  );
}
