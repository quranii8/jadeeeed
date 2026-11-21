"use client";

/**
 * Draws a 1080×1920 zellige share card on the visitor's device and hands it to the
 * share sheet (or downloads it). Nothing is uploaded anywhere.
 */

const W = 1080;
const H = 1920;
const COBALT = "#1B3A8C";
const DEEP = "#10275F";
const PLASTER = "#EEF1EC";
const SAFFRON = "#D99A1E";
const EMERALD = "#0E6B5A";
const TERRACOTTA = "#B4472F";
const INK = "#0E1630";

type Kind = "verse" | "hadith";

function starPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, rot = 0) {
  const inner = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? R : inner;
    const a = rot + (i * Math.PI) / 8;
    const x = cx + r * Math.sin(a);
    const y = cy - r * Math.cos(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function lattice(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.lineWidth = 3;
  for (let y = 0; y < H + 112; y += 112) {
    for (let x = 0; x < W + 112; x += 112) {
      starPath(ctx, x, y, 40);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function tileStrip(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = PLASTER;
  ctx.fillRect(0, y, W, 28);
  const colors = [SAFFRON, EMERALD, TERRACOTTA, COBALT];
  for (let i = 0, x = 14; x < W; i++, x += 28) {
    ctx.fillStyle = colors[i % 4];
    ctx.beginPath();
    ctx.moveTo(x, y + 3);
    ctx.lineTo(x + 11, y + 14);
    ctx.lineTo(x, y + 25);
    ctx.lineTo(x - 11, y + 14);
    ctx.closePath();
    ctx.fill();
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function cssFont(variable: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

export async function renderShareCard({ kind, text, reference }: { kind: Kind; text: string; reference: string }): Promise<Blob> {
  const textFamily = kind === "verse" ? cssFont("--font-amiri", "Amiri, serif") : cssFont("--font-amiri", "Amiri, serif");
  const uiFamily = cssFont("--font-noto-kufi", "sans-serif");
  await Promise.all([
    document.fonts.load(`700 60px ReemKufi`),
    document.fonts.load(`400 60px ${textFamily}`),
    document.fonts.load(`600 36px ${uiFamily}`),
  ]).catch(() => undefined);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.direction = "rtl";

  // cobalt glaze field with the star lattice
  ctx.fillStyle = kind === "verse" ? COBALT : DEEP;
  ctx.fillRect(0, 0, W, H);
  lattice(ctx);
  tileStrip(ctx, 0);
  tileStrip(ctx, H - 28);

  // heading on the field
  ctx.textAlign = "center";
  ctx.fillStyle = "#F4F6FB";
  ctx.font = `700 64px ReemKufi, ${uiFamily}`;
  ctx.fillText(kind === "verse" ? "آية" : "حديث", W / 2, 210);
  starPath(ctx, W / 2, 290, 30);
  ctx.fillStyle = SAFFRON;
  ctx.fill();

  // plaster panel with chamfered corners
  const px = 80, pw = W - 160, top = 380, bottom = H - 330, c = 50;
  ctx.fillStyle = PLASTER;
  ctx.beginPath();
  ctx.moveTo(px + c, top);
  ctx.lineTo(px + pw - c, top);
  ctx.lineTo(px + pw, top + c);
  ctx.lineTo(px + pw, bottom - c);
  ctx.lineTo(px + pw - c, bottom);
  ctx.lineTo(px + c, bottom);
  ctx.lineTo(px, bottom - c);
  ctx.lineTo(px, top + c);
  ctx.closePath();
  ctx.shadowColor = "rgba(6,14,40,.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  ctx.fill();
  ctx.shadowColor = "transparent";

  // fit the text: shrink until it fits, then cut at a word boundary with a clear note
  const maxW = pw - 120;
  const room = bottom - top - 260;
  let size = kind === "verse" ? 68 : 58;
  let lines: string[] = [];
  let lineH = 0;
  let cut = false;
  for (; size >= 34; size -= 2) {
    ctx.font = `400 ${size}px ${textFamily}`;
    lines = wrap(ctx, text, maxW);
    lineH = size * 1.95;
    if (lines.length * lineH <= room) break;
  }
  if (lines.length * lineH > room) {
    const keep = Math.max(1, Math.floor(room / lineH) - 1);
    lines = lines.slice(0, keep);
    lines[lines.length - 1] += " …";
    cut = true;
  }
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  const blockH = lines.length * lineH;
  let y = top + 110 + (room - blockH) / 2 + size;
  for (const l of lines) {
    ctx.fillText(l, W / 2, y);
    y += lineH;
  }

  // reference under a saffron rule
  ctx.fillStyle = SAFFRON;
  ctx.fillRect(W / 2 - 60, bottom - 150, 120, 4);
  ctx.fillStyle = COBALT;
  ctx.font = `600 38px ${uiFamily}`;
  ctx.fillText(reference, W / 2, bottom - 85);
  if (cut) {
    ctx.fillStyle = "#5F6A80";
    ctx.font = `500 28px ${uiFamily}`;
    ctx.fillText("النص كاملاً على الموقع", W / 2, bottom - 40);
  }

  // signature
  ctx.fillStyle = "#F4F6FB";
  ctx.font = `700 52px ReemKufi, ${uiFamily}`;
  ctx.fillText("منصة القرآن الكريم", W / 2, H - 190);
  ctx.fillStyle = "#C3CEEB";
  ctx.font = `600 34px ${uiFamily}`;
  ctx.direction = "ltr";
  ctx.fillText("jadeeeed.vercel.app", W / 2, H - 130);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas"))), "image/png"));
}

export async function shareAsImage(opts: { kind: Kind; text: string; reference: string; filename: string }) {
  const blob = await renderShareCard(opts);
  const file = new File([blob], `${opts.filename}.png`, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: opts.reference });
      return;
    } catch {
      return; // the visitor closed the share sheet
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
