"use client";

import { useEffect } from "react";
import { mapCoords } from "@/lib/constants";

declare global {
  interface Window {
    ymaps?: {
      ready: (callback: () => void) => void;
      Placemark: new (coords: number[], properties: Record<string, unknown>, options: Record<string, unknown>) => unknown;
      Map: new (
        id: string,
        state: Record<string, unknown>,
      ) => {
        geoObjects: { add: (object: unknown) => void };
        controls: { add: (object: unknown, options?: Record<string, unknown>) => void };
      };
      control: {
        TypeSelector: new () => unknown;
        ZoomControl: new () => unknown;
      };
    };
    openSafeHandsRoute?: (event?: Event) => boolean;
  }
}

export function YandexMap() {
  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      if (cancelled || !window.ymaps || document.getElementById("map")?.dataset.ready) {
        return;
      }

      window.ymaps.ready(() => {
        const coords = [mapCoords.lat, mapCoords.lon];
        const webRouteUrl = `https://yandex.ru/maps/?rtext=~${coords[0]},${coords[1]}&rtt=auto`;
        const googleRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}&travelmode=driving&dir_action=navigate`;
        const appleRouteUrl = `https://maps.apple.com/?daddr=${coords[0]},${coords[1]}&dirflg=d`;
        const yandexNavigatorUrl = `yandexnavi://build_route_on_map?lat_to=${coords[0]}&lon_to=${coords[1]}`;
        const androidRouteUrl = `intent://build_route_on_map?lat_to=${coords[0]}&lon_to=${coords[1]}#Intent;scheme=yandexnavi;package=ru.yandex.yandexnavi;S.browser_fallback_url=${encodeURIComponent(googleRouteUrl)};end`;

        window.openSafeHandsRoute = (event?: Event) => {
          event?.preventDefault();
          event?.stopPropagation();

          if (/Android/i.test(navigator.userAgent)) {
            window.location.href = androidRouteUrl;
          } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = yandexNavigatorUrl;
            setTimeout(() => {
              if (!document.hidden) window.location.href = googleRouteUrl;
            }, 900);
            setTimeout(() => {
              if (!document.hidden) window.location.href = appleRouteUrl;
            }, 1800);
            setTimeout(() => {
              if (!document.hidden) window.location.href = webRouteUrl;
            }, 2700);
          } else {
            window.open(webRouteUrl, "_blank");
          }

          return false;
        };

        const mark = new window.ymaps!.Placemark(
          coords,
          {
            iconContent: "Надежные Руки",
            hintContent: "Шиномонтаж",
            balloonContentHeader: "ООО «Надежные Руки»",
            balloonContentBody: [
              "Шиномонтаж",
              `<br><a class="btn-red route-button" href="${webRouteUrl}" target="_blank" rel="noopener" onclick="return window.openSafeHandsRoute(event)">Построить маршрут</a>`,
            ].join(""),
            balloonContentFooter: "г. Минск, ул. Меньковский тракт 2",
          },
          { preset: "islands#blueStretchyIcon" },
        );

        const myMap = new window.ymaps!.Map("map", {
          center: coords,
          zoom: 14,
          type: "yandex#map",
        });

        myMap.geoObjects.add(mark);
        myMap.controls.add(new window.ymaps!.control.TypeSelector(), { position: { top: 128, right: 20 } });
        myMap.controls.add(new window.ymaps!.control.ZoomControl(), { position: { top: 128, left: 20 } });
        document.getElementById("map")?.setAttribute("data-ready", "true");
      });
    };

    if (window.ymaps) {
      initMap();
    } else {
      const interval = window.setInterval(() => {
        if (window.ymaps) {
          window.clearInterval(interval);
          initMap();
        }
      }, 100);

      return () => {
        cancelled = true;
        window.clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return <div id="map" aria-label="Карта расположения шиномонтажа" />;
}
