import type { Metadata } from "next";
import { reservationStatuses, statusClasses, type ReservationStatus } from "@/lib/constants";
import { ensureDatabase, prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Список людей записавшихся на шиномонтаж",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-BY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Minsk",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ru-BY", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Minsk",
  }).format(date);
}

function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "short",
    timeZone: "Europe/Minsk",
  }).format(date);
}

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ prev?: string }>;
}) {
  await ensureDatabase();

  const { prev } = await searchParams;
  const parsedWeeksBack = Number(prev ?? 0);
  const weeksBack = Number.isFinite(parsedWeeksBack) ? parsedWeeksBack : 0;
  const start = new Date();
  start.setDate(start.getDate() - weeksBack * 7);

  const reservations = await prisma.reservation.findMany({
    where: { time: { gte: start } },
    orderBy: { time: "asc" },
  });

  const previousWeekStart = new Date();
  previousWeekStart.setDate(previousWeekStart.getDate() - (weeksBack + 2) * 7);
  const previousWeekEnd = new Date();
  previousWeekEnd.setDate(previousWeekEnd.getDate() - (weeksBack + 1) * 7);

  const [previousWeekCount, olderCount] = await Promise.all([
    prisma.reservation.count({ where: { time: { gte: previousWeekStart, lte: previousWeekEnd } } }),
    prisma.reservation.count({ where: { time: { lte: previousWeekEnd } } }),
  ]);

  let lastDay = "";

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Список людей записавшихся на шиномонтаж</h1>
        <a className="prev" href={`/reservations?prev=${weeksBack + 1}`}>
          загрузить неделю раньше ↑ ({previousWeekCount} из {olderCount})
        </a>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>e-mail</th>
              <th>Статус</th>
              <th>Сменить статус</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const currentDay = dayKey(reservation.time);
              const isNewDay = currentDay !== lastDay;
              lastDay = currentDay;

              return (
                <tr className={isNewDay ? "new-day" : ""} key={reservation.id}>
                  <td>{isNewDay ? formatDate(reservation.time) : ""}</td>
                  <td>{formatTime(reservation.time)}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.email}</td>
                  <td>{reservationStatuses[reservation.status as ReservationStatus]}</td>
                  <td>
                    <div className="admin-status-actions">
                      {Object.entries(reservationStatuses).map(([status, label]) => {
                        const statusId = Number(status) as ReservationStatus;
                        const active = reservation.status === statusId;

                        return (
                          <form action={`/api/reservations/${reservation.id}/status`} method="post" key={status}>
                            <input name="status" type="hidden" value={status} />
                            <button className={`status-button ${statusClasses[statusId]}`} disabled={active} type="submit">
                              {label}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
