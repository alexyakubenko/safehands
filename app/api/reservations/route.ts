import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { sendReservationNotifications } from "@/lib/notifications";

export async function POST(request: Request) {
  await ensureDatabase();

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    email?: string;
    time?: string;
  } | null;

  const name = body?.name?.trim();
  const time = body?.time ? new Date(body.time) : null;

  if (!name || !time || Number.isNaN(time.getTime())) {
    return NextResponse.json({ success: false, error: "Некорректные данные записи" }, { status: 400 });
  }

  if (time.getTime() < Date.now()) {
    return NextResponse.json({ success: false, error: "Нельзя записаться на прошедшее время" }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone: body?.phone?.trim() || null,
        email: body?.email?.trim() || null,
        time,
      },
    });

    void sendReservationNotifications(reservation);

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Это время уже занято" }, { status: 409 });
    }

    return NextResponse.json({ success: false, error: "Не удалось сохранить запись" }, { status: 500 });
  }
}
