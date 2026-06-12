import type { MetadataRoute } from "next";
import { prices } from "@/lib/prices";
import { siteUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const priceUrls = Object.entries(prices).flatMap(([serviceKey, service]) => {
    if ("table" in service) {
      return [`/price/${serviceKey}`];
    }

    return Object.keys(service.cars).map((carKey) => `/price/${serviceKey}/${carKey}`);
  });

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/reservation`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...priceUrls.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
