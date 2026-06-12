import type { Metadata } from "next";
import "./globals.css";
import { businessAddress, contacts, mapCoords, organizationName, siteDescription, siteUrl } from "@/lib/constants";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Шиномонтаж «Надежные Руки» Минск",
    template: "%s | Надежные Руки",
  },
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
    "ремонт дисков",
    "правка дисков",
  ],
  authors: [{ name: "Alex Yakubenko" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: siteUrl,
    siteName: "Надежные Руки",
    title: "Шиномонтаж «Надежные Руки» Минск",
    description: siteDescription,
    images: [
      {
        url: "/images/logo.png",
        width: 220,
        height: 220,
        alt: "Надежные Руки",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: organizationName,
    url: siteUrl,
    image: `${siteUrl}/images/logo.png`,
    telephone: contacts[0]?.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      ...businessAddress,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: mapCoords.lat,
      longitude: mapCoords.lon,
    },
    areaServed: "Минск",
    sameAs: ["https://www.instagram.com/safehandsby/"],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Шиномонтаж" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт шин" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ремонт дисков" } },
    ],
  };

  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
