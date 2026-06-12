import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ||= "file:./data/safehands.db";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  databaseReady?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

function sqlitePathFromUrl(url: string) {
  if (!url.startsWith("file:")) {
    return null;
  }

  return url.replace(/^file:/, "");
}

export function ensureDatabase() {
  globalForPrisma.databaseReady ??= (async () => {
    const dbPath = sqlitePathFromUrl(process.env.DATABASE_URL ?? "file:./data/safehands.db");

    if (dbPath && !dbPath.startsWith(":")) {
      await mkdir(dirname(fileURLToPath(`file://${dbPath.startsWith("/") ? dbPath : `${process.cwd()}/${dbPath}`}`)), {
        recursive: true,
      });
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Reservation" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "email" TEXT,
        "time" DATETIME NOT NULL,
        "status" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Reservation_time_key" ON "Reservation"("time")
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SmsNotification" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "responseBody" TEXT,
        "reservationId" INTEGER NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SmsNotification_reservationId_fkey"
          FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SmsNotificationReport" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "params" TEXT NOT NULL,
        "smsNotificationId" INTEGER NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SmsNotificationReport_smsNotificationId_fkey"
          FOREIGN KEY ("smsNotificationId") REFERENCES "SmsNotification" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  })();

  return globalForPrisma.databaseReady;
}
