import { NextResponse } from "next/server";
import { ensureDatabase, prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await ensureDatabase();

  const { id } = await context.params;
  const body = await request.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  await prisma.smsNotificationReport.create({
    data: {
      smsNotificationId: Number(id),
      params: JSON.stringify(params),
    },
  });

  return new NextResponse(null, { status: 200 });
}
