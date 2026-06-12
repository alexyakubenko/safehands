"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contacts } from "@/lib/constants";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Header() {
  const pathname = usePathname();

  return (
    <header id="header">
      <Link id="title" href="/">
        «Надежные Руки»
      </Link>
      <nav id="menu" aria-label="Основная навигация">
        <Link className={pathname === "/" ? "active" : ""} href="/">
          Наше расположение
        </Link>
        <Link className={pathname.startsWith("/price/tires") ? "active" : ""} href="/price/tires/light">
          Шиномонтаж
        </Link>
        <Link className={pathname.startsWith("/price/repair") ? "active" : ""} href="/price/repair/light">
          Ремонт шин
        </Link>
        <Link className={pathname.startsWith("/price/wheels") ? "active" : ""} href="/price/wheels">
          Ремонт дисков
        </Link>
      </nav>
      <div id="contacts">
        {contacts.map((contact) => (
          <div className="phone" key={contact.phone}>
            <a className="number" href={phoneHref(contact.phone)}>
              {contact.phone}
            </a>
            <img className="operator-icon" src={`/icons/${contact.gsm}.png`} alt="" />
          </div>
        ))}
      </div>
    </header>
  );
}
