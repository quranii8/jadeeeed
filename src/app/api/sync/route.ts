import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 400_000;

async function userId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

/** The signed-in visitor's saved state (bookmarks, reading, khatma, saved hadiths, skin). */
export async function GET() {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await prisma.userState.findUnique({ where: { userId: id } });
  return NextResponse.json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
}

export async function PUT(req: Request) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "Too large" }, { status: 413 });
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Bad data" }, { status: 400 });
  const row = await prisma.userState.upsert({
    where: { userId: id },
    create: { userId: id, data: data as object },
    update: { data: data as object },
  });
  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
