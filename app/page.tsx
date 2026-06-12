import type { Metadata } from "next";
import { siteDescription } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Шиномонтаж в Минске",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return null;
}
