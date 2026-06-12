import nodemailer from "nodemailer";
import type { Reservation } from "@prisma/client";
import { prisma } from "./prisma";

function formatReservationTime(date: Date) {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Minsk",
  }).format(date);
}

function smsText(reservation: Reservation) {
  return [
    `Запись ${formatReservationTime(reservation.time)}.`,
    reservation.phone ? reservation.phone : "",
    reservation.name ? `(${reservation.name})` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function sendReservationNotifications(reservation: Reservation) {
  await Promise.allSettled([sendEmail(reservation), sendSms(reservation)]);
}

async function sendEmail(reservation: Reservation) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_TO } = process.env;

  if (!SMTP_HOST || !SMTP_TO) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: SMTP_USER && SMTP_PASSWORD ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
  });

  await transporter.sendMail({
    from: SMTP_FROM || "reservation@safehands.by",
    to: SMTP_TO,
    subject: `запись на шиномонтаж на ${formatReservationTime(reservation.time)}`,
    text: [
      `Имя: ${reservation.name}`,
      `Телефон: ${reservation.phone || "-"}`,
      `Email: ${reservation.email || "-"}`,
      `Время: ${formatReservationTime(reservation.time)}`,
    ].join("\n"),
  });
}

async function sendSms(reservation: Reservation) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TO } = process.env;
  const notification = await prisma.smsNotification.create({
    data: { reservationId: reservation.id },
  });

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !TWILIO_TO) {
    return;
  }

  const callbackBase = process.env.PUBLIC_BASE_URL?.replace(/\/$/, "");
  const params = new URLSearchParams({
    From: TWILIO_FROM,
    To: TWILIO_TO,
    Body: smsText(reservation),
  });

  if (callbackBase) {
    params.set("StatusCallback", `${callbackBase}/api/sms-notification-report/${notification.id}`);
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  await prisma.smsNotification.update({
    where: { id: notification.id },
    data: { responseBody: await response.text() },
  });
}
