export const contacts = [
  {
    phone: "+375 (44) 574 22 93",
    gsm: "velcom",
  },
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://safehands.by";

export const organizationName = "ООО «Надежные Руки»";

export const businessAddress = {
  streetAddress: "Меньковский тракт, 2",
  addressLocality: "Минск",
  addressCountry: "BY",
};

export const reservationStatuses = {
  0: "Записан",
  1: "Обслужен",
  2: "Не приехал",
} as const;

export type ReservationStatus = keyof typeof reservationStatuses;

export const statusClasses: Record<ReservationStatus, string> = {
  0: "info",
  1: "success",
  2: "danger",
};

export const siteDescription =
  "ООО Надежные Руки. Шиномонтаж в Минске на авторынке малиновка. Оказываем следующие услуги по разумной цене: легковой шиномонтаж, грузовой шиномонтаж, шиномонтаж сельскохозяйственной техники, а так же все виды ремонта шин.";

export const mapCoords = {
  lat: 53.85128,
  lon: 27.42097,
};
