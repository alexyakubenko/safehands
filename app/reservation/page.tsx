import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Запись на шиномонтаж | Надежные Руки",
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
