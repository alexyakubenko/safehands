window.getWindowSize = ->
  if typeof(window.innerWidth) == 'number'
    #Non-IE
    [window.innerWidth, window.innerHeight]
  else if document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)
    #IE 6+ in 'standards compliant mode'
    [document.documentElement.clientWidth, document.documentElement.clientHeight]
  else if document.body && (document.body.clientWidth || document.body.clientHeight)
    #IE 4 compatible
    [document.body.clientWidth, document.body.clientHeight]

resizeMap = ->
  winSize = window.getWindowSize()
  winW = winSize[0]
  winH = winSize[1]
  document.getElementById('map').style.height = "#{ winH }px";

window.onresize = resizeMap;
if true
  window.onload = ->
    resizeMap()

    ymaps.ready ->
      coords = [53.85128, 27.42097]
      webRouteUrl = "https://yandex.ru/maps/?rtext=~#{ coords[0] },#{ coords[1] }&rtt=auto"
      googleRouteUrl = "https://www.google.com/maps/dir/?api=1&destination=#{ coords[0] },#{ coords[1] }&travelmode=driving&dir_action=navigate"
      appleRouteUrl = "https://maps.apple.com/?daddr=#{ coords[0] },#{ coords[1] }&dirflg=d"
      yandexNavigatorUrl = "yandexnavi://build_route_on_map?lat_to=#{ coords[0] }&lon_to=#{ coords[1] }"
      androidRouteUrl = "intent://build_route_on_map?lat_to=#{ coords[0] }&lon_to=#{ coords[1] }#Intent;scheme=yandexnavi;package=ru.yandex.yandexnavi;S.browser_fallback_url=#{ encodeURIComponent(googleRouteUrl) };end"

      window.openRoute = (event) ->
        if event?
          event.preventDefault()
          event.stopPropagation()

        userAgent = navigator.userAgent

        if /Android/i.test(userAgent)
          window.location.href = androidRouteUrl
        else if /iPhone|iPad|iPod/i.test(userAgent)
          window.location.href = yandexNavigatorUrl
          setTimeout((-> window.location.href = googleRouteUrl unless document.hidden), 900)
          setTimeout((-> window.location.href = appleRouteUrl unless document.hidden), 1800)
          setTimeout((-> window.location.href = webRouteUrl unless document.hidden), 2700)
        else
          window.open(webRouteUrl, '_blank')

        false

      mark = new ymaps.Placemark(
        coords, {
          iconContent: 'Надежные Руки',
          hintContent: 'Шиномонтаж',
          balloonContentHeader: 'ООО «Надежные Руки»',
          balloonContentBody: [
            'Шиномонтаж',
            "<br><a class='btn-red route-button' href='#{ webRouteUrl }' target='_blank' rel='noopener' onclick='return window.openRoute(event)'>Построить маршрут</a>"
          ].join(''),
          balloonContentFooter: 'г. Минск, ул. Меньковский тракт 2'
        }, {
          preset: 'islands#blueStretchyIcon'
        }
      )

      myMap = new ymaps.Map('map', {
        center: coords,
        zoom: 14,
        type: 'yandex#map'
      })

      myMap.geoObjects.add(mark)
      myMap.controls.add(new ymaps.control.TypeSelector(), { position: { top: 128, right: 20 } })
      myMap.controls.add(new ymaps.control.ZoomControl(), { position: { top: 128, left: 20 } })
