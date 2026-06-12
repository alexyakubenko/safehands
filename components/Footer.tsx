"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const hideReservationButton = pathname === "/reservation";

  return (
    <footer id="footer">
      <div id="copy-rights">ООО «Надежные Руки» ©, 2026</div>
      {!hideReservationButton && (
        <Link id="request-button" className="btn-red" href="/reservation">
          ЗАПИСАТЬСЯ НА ШИНОМОНТАЖ
        </Link>
      )}
      <div id="social-buttons">
        <a href="mailto:mail@safehands.by" aria-label="Email">
          @
        </a>
        <a href="https://www.instagram.com/safehandsby/" target="_blank" rel="noreferrer" aria-label="Instagram">
          ◎
        </a>
      </div>
    </footer>
  );
}
