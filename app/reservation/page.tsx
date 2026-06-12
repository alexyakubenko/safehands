import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Запись на шиномонтаж",
  description: "Онлайн-запись на шиномонтаж в ООО «Надежные Руки» в Минске.",
  alternates: {
    canonical: "/reservation",
  },
};

export default function ReservationPage() {
  return (
    <section id="popup" className="reservation">
      <h1>Запись на шиномонтаж</h1>
      <div className="content">
        <ReservationForm />
      </div>
    </section>
  );
}
