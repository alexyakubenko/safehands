import type { Metadata } from "next";
import "./globals.css";
import { siteDescription } from "@/lib/constants";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Шиномонтаж «Надежные Руки» Минск",
  description: siteDescription,
  keywords: [
    "шиномонтаж",
    "грузовой шиномонтаж",
    "минск",
    "ремонт шин",
    "вулканизация",
    "нарезка протектора",
    "разумные цены",
    "надежные руки",
  ],
  authors: [{ name: "Alex Yakubenko" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
