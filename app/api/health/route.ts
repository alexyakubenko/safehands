import { NextResponse } from "next/server";
import { ensureDatabase, prisma } from "@/lib/prisma";

export async function GET() {
  await ensureDatabase();
  await prisma.reservation.count();

  return NextResponse.json({ status: "OK" });
}
