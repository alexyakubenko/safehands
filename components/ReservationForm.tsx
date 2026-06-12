"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ReservationResult =
  | { success: true; reservation: { time: string; name: string } }
  | { success: false; error: string };

type Step = "calendar" | "time" | "slot" | "details";

const monthNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const weekdays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function sameDay(left: Date, right: Date) {
  return localDateValue(left) === localDateValue(right);
}

function buildHours() {
  const hours: string[] = [];

  for (let hour = 0; hour <= 23; hour += 1) {
    hours.push(`${pad(hour)}:00`);
  }

  return hours;
}

function buildSlots(hour: string) {
  return [0, 15, 30, 45].map((minute) => `${hour}:${pad(minute)}`);
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function formatSuccessTime(value: string) {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatSelectedDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function ReservationForm() {
  const today = useMemo(() => new Date(), []);
  const hours = useMemo(buildHours, []);
  const [step, setStep] = useState<Step>("calendar");
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState(localDateValue(today));
  const [time, setTime] = useState(hours[0]);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReservationResult | null>(null);

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const selectedHour = time.slice(0, 2);
  const selectedHourSlots = useMemo(() => buildSlots(selectedHour), [selectedHour]);
  const monthTitle = `${visibleMonth.getFullYear()}-${monthNames[visibleMonth.getMonth()]}`;

  useEffect(() => {
    const controller = new AbortController();
    const selected = new Date(`${date}T00:00:00`);

    fetch(`/api/reservations/availability?view=day&date=${date}&time=${encodeURIComponent(selected.toISOString())}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { reservations?: number[] }) => {
        setBusySlots(
          (data.reservations ?? []).map((timestamp) => {
            const item = new Date(timestamp);
            return `${pad(item.getHours())}:${pad(item.getMinutes())}`;
          }),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBusySlots([]);
        }
      });

    return () => controller.abort();
  }, [date]);

  function changeMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function chooseDate(nextDate: Date) {
    setDate(localDateValue(nextDate));
    setStep("time");
  }

  function changeDate(delta: number) {
    const current = new Date(`${date}T00:00:00`);
    current.setDate(current.getDate() + delta);
    const todayStart = new Date(localDateValue(today));

    if (current < todayStart) {
      return;
    }

    setDate(localDateValue(current));
  }

  function hourIsBusy(hour: string) {
    return buildSlots(hour.slice(0, 2)).every((slot) => busySlots.includes(slot));
  }

  function chooseHour(nextTime: string) {
    setTime(nextTime);
    setStep("slot");
  }

  function changeHour(delta: number) {
    const nextHour = Math.min(23, Math.max(0, Number(selectedHour) + delta));
    setTime(`${pad(nextHour)}:00`);
  }

  function chooseSlot(nextTime: string) {
    setTime(nextTime);
    setStep("details");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    const reservationTime = new Date(`${date}T${time}:00`);

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        time: reservationTime.toISOString(),
      }),
    });

    const data = (await response.json()) as ReservationResult;
    setResult(data);
    setSubmitting(false);
  }

  if (result?.success) {
    return (
      <div className="reservation-success">
        <h3>{result.reservation.name}</h3>
        <h4>Спасибо за запись</h4>
        <h4>Мы будем ждать вас</h4>
        <h4>{formatSuccessTime(result.reservation.time)}</h4>
        <h4>в Надежных Руках!</h4>
      </div>
    );
  }

  if (step === "calendar") {
    return (
      <div className="reservation-calendar">
        <div className="calendar-nav">
          <button aria-label="Предыдущий месяц" onClick={() => changeMonth(-1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-left" />
          </button>
          <strong>{monthTitle}</strong>
          <button aria-label="Следующий месяц" onClick={() => changeMonth(1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-right" />
          </button>
        </div>

        <div className="calendar-grid calendar-weekdays">
          {weekdays.map((weekday) => (
            <div key={weekday}>{weekday}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day) => {
            const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
            const isPast = new Date(localDateValue(day)) < new Date(localDateValue(today));

            return (
              <button
                className={`${isOutsideMonth ? "outside" : ""} ${sameDay(day, today) ? "today" : ""}`}
                disabled={isPast}
                key={day.toISOString()}
                onClick={() => chooseDate(day)}
                type="button"
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "time") {
    return (
      <div className="reservation-time">
        <div className="calendar-nav">
          <button aria-label="Предыдущий день" onClick={() => changeDate(-1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-left" />
          </button>
          <button className="calendar-title-button" onClick={() => setStep("calendar")} type="button">
            {formatSelectedDate(date)}
          </button>
          <button aria-label="Следующий день" onClick={() => changeDate(1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-right" />
          </button>
        </div>
        <div className="time-grid">
          {hours.map((hour) => (
            <button disabled={hourIsBusy(hour)} key={hour} onClick={() => chooseHour(hour)} type="button">
              {hour}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "slot") {
    return (
      <div className="reservation-time">
        <div className="calendar-nav">
          <button aria-label="Предыдущий час" disabled={selectedHour === "00"} onClick={() => changeHour(-1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-left" />
          </button>
          <button className="calendar-title-button" onClick={() => setStep("time")} type="button">
            {formatSelectedDate(date)}, {selectedHour}:00
          </button>
          <button aria-label="Следующий час" disabled={selectedHour === "23"} onClick={() => changeHour(1)} type="button">
            <span aria-hidden="true" className="calendar-arrow calendar-arrow-right" />
          </button>
        </div>
        <div className="time-grid slot-grid">
          {selectedHourSlots.map((slot) => (
            <button disabled={busySlots.includes(slot)} key={slot} onClick={() => chooseSlot(slot)} type="button">
              {slot}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form className="confirm-form" onSubmit={submit}>
      <div className="calendar-nav confirm-header">
        <button aria-label="Назад к выбору слота" onClick={() => setStep("slot")} type="button">
          <span aria-hidden="true" className="calendar-arrow calendar-arrow-left" />
        </button>
        <strong>
          {formatSelectedDate(date)}, {time}
        </strong>
        <span />
      </div>

      <label>
        <input name="name" onChange={(event) => setName(event.target.value)} placeholder="Имя" required type="text" value={name} />
      </label>
      <label>
        <input name="phone" onChange={(event) => setPhone(event.target.value)} placeholder="Номер телефона" type="tel" value={phone} />
      </label>
      <label>
        <input name="email" onChange={(event) => setEmail(event.target.value)} placeholder="Адрес электронной почты" type="email" value={email} />
      </label>

      {result && !result.success && <p className="form-error">{result.error}</p>}

      <button className="btn-red btn-block" disabled={isSubmitting || busySlots.includes(time)} type="submit">
        {isSubmitting ? "Сохраняем..." : "Подтвердить запись"}
      </button>
    </form>
  );
}
