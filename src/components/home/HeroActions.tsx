"use client";

import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
import { useQuranStore } from "@/lib/store";

/** Continue where the reader stopped; first-time visitors start at the index of surahs. */
export function HeroActions() {
  const lastRead = useQuranStore((s) => s.lastRead);
  const href = lastRead ? `/surah/${lastRead.surah}${lastRead.verse ? `#verse-${lastRead.verse}` : ""}` : "/surahs";
  return (
    <div className="mt-4 flex flex-wrap gap-3 justify-center">
      <Link href={href} className="btn btn-primary">
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        {lastRead ? "متابعة القراءة" : "ابدأ القراءة"}
      </Link>
      <Link
        href="/reciters"
        className="btn"
        style={{ background: "rgba(7,11,30,.55)", borderColor: "rgba(247,243,234,.6)", color: "#F7F3EA" }}
      >
        <Headphones className="w-4 h-4" aria-hidden="true" />
        استمع
      </Link>
    </div>
  );
}
