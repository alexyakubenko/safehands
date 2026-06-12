import type { Metadata } from "next";
import Link from "next/link";
import { getPriceSelection, type PriceTable } from "@/lib/prices";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const selection = getPriceSelection(slug[0], slug[1]);
  const canonical = selection.carKey ? `/price/${selection.serviceKey}/${selection.carKey}` : `/price/${selection.serviceKey}`;
  const title = selection.car
    ? `Цены на ${selection.service.name}: ${selection.car.name}`
    : `Цены на ${selection.service.name}`;
  const description = selection.car
    ? `Актуальные цены на ${selection.service.name} для категории «${selection.car.name}» в ООО «Надежные Руки» в Минске.`
    : `Актуальные цены на ${selection.service.name} в ООО «Надежные Руки» в Минске.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function PricePage({ params }: Props) {
  const { slug = [] } = await params;
  const selection = getPriceSelection(slug[0], slug[1]);
  const table: PriceTable = selection.table;

  return (
    <section id="popup" className="price">
      <h1>Цены на {selection.service.name}</h1>

      {"cars" in selection.service && (
        <div className="menu cars">
          <div className="btn-group">
            {Object.entries(selection.service.cars).map(([carKey, car]) => (
              <Link
                className={`car btn ${selection.carKey === carKey ? "btn-primary" : "btn-default"}`}
                href={`/price/${selection.serviceKey}/${carKey}`}
                key={carKey}
              >
                {car.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="content table-scroll">
        <table>
          {table.headers && (
            <thead>
              <tr>
                {table.headers.map((header) => (
                  <th key={header || "service"}>{header}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td className={index === 0 && cell.length > 32 ? "wrap" : ""} key={`${cell}-${index}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
