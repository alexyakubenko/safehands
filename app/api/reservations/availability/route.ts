import { NextResponse } from "next/server";
import { ensureDatabase, prisma } from "@/lib/prisma";

const HOUR = 60 * 60 * 1000;

export async function GET(request: Request) {
  await ensureDatabase();

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");
  const value = searchParams.get("time");
  const time = value ? new Date(value) : null;

  if (!time || Number.isNaN(time.getTime())) {
    return NextResponse.json({ reservations: [] });
  }

  if (view === "hour") {
    const nextDay = new Date(time.getTime() + 24 * HOUR);
    const start = new Date(nextDay);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(nextDay);
    end.setUTCHours(23, 59, 59, 999);

    const reservations = await prisma.reservation.findMany({
      where: { time: { gte: start, lte: end } },
      select: { time: true },
    });

    const timestamps = reservations.map((item) => item.time.getTime());
    const blockedHours = timestamps
      .filter((timestamp) => new Date(timestamp).getUTCMinutes() === 0)
      .filter((timestamp) => timestamps.filter((candidate) => candidate >= timestamp && candidate <= timestamp + HOUR).length >= 4);

    return NextResponse.json({ reservations: blockedHours });
  }

  if (view === "minute") {
    const start = new Date(time);
    start.setUTCMinutes(0, 0, 0);
    const end = new Date(time);
    end.setUTCMinutes(59, 59, 999);

    const reservations = await prisma.reservation.findMany({
      where: { time: { gte: start, lte: end } },
      select: { time: true },
    });

    return NextResponse.json({ reservations: reservations.map((item) => item.time.getTime()) });
  }

  if (view === "day") {
    const date = searchParams.get("date");
    const start = date ? new Date(`${date}T00:00:00+03:00`) : new Date(time);
    const end = date ? new Date(`${date}T23:59:59.999+03:00`) : new Date(time);

    if (!date) {
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);
    }

    const reservations = await prisma.reservation.findMany({
      where: { time: { gte: start, lte: end } },
      select: { time: true },
    });

    return NextResponse.json({ reservations: reservations.map((item) => item.time.getTime()) });
  }

  return NextResponse.json({ reservations: [] });
}
