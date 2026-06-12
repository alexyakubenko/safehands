"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { YandexMap } from "@/components/YandexMap";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/reservations");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src="https://api-maps.yandex.ru/2.1.27/?lang=ru_RU&load=Map,Polyline,control.ZoomControl,control.TypeSelector,Placemark,geoObject.addon.balloon,geoObject.addon.hint,route,templateLayoutFactory"
        strategy="afterInteractive"
      />
      <Header />
      <main id="content">{children}</main>
      <YandexMap />
      <Footer />
    </>
  );
}
