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
      routeUrl = "https://yandex.ru/maps/?rtext=~#{ coords[0] },#{ coords[1] }&rtt=auto"

      mark = new ymaps.Placemark(
        coords, {
          iconContent: 'Надежные Руки',
          hintContent: 'Шиномонтаж',
          balloonContentHeader: 'ООО «Надежные Руки»',
          balloonContentBody: [
            'Шиномонтаж',
            "<br><a class='btn-red route-button' href='#{ routeUrl }' target='_blank' rel='noopener'>Построить маршрут</a>"
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
