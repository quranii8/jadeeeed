/** زخرفة هندسية إسلامية (نجمة ثمانية متكررة) تُستخدم خلفيةً للعناوين */
export function OrnamentPattern({ id = "orn", opacity = 0.14 }: { id?: string; opacity?: number }) {
  return (
    <svg className="ornament-pattern absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" style={{ opacity }}>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="white" strokeWidth="1.2">
            <path d="M28 6 34 22 50 28 34 34 28 50 22 34 6 28 22 22Z" />
            <path d="M28 14 40 16 42 28 40 40 28 42 16 40 14 28 16 16Z" />
            <circle cx="28" cy="28" r="4" />
            <path d="M0 0 6 6M56 0 50 6M0 56 6 50M56 56 50 50" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** فاصل زخرفي بين الأقسام */
export function OrnamentDivider() {
  return (
    <div className="flex items-center gap-3 my-6" aria-hidden="true" style={{ color: "var(--gold)" }}>
      <span className="flex-1 h-px" style={{ background: "currentColor", opacity: 0.4 }} />
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M28 6 34 22 50 28 34 34 28 50 22 34 6 28 22 22Z" />
        <circle cx="28" cy="28" r="5" />
      </svg>
      <span className="flex-1 h-px" style={{ background: "currentColor", opacity: 0.4 }} />
    </div>
  );
}
