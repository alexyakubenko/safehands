function getWindowHeight() {
  var myHeight = 0;

  if (typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myHeight = document.body.clientHeight;
  }

  return myHeight;
}

function resizeMap() {
  document.getElementById('map').style.height = getWindowHeight() + 'px';
}

window.onresize = resizeMap;

window.onload = function() {
  var myMap;

  resizeMap();

  ymaps.ready(function() {
    var route = new ymaps.Polyline([
          // Указываем координаты вершин ломаной.
          [53.8775088, 27.51766131],
          [53.87689385, 27.519324280000003],
          [53.87657052, 27.519013140000002],
          [53.87642471, 27.51902387],
          [53.87567027, 27.52016112],
          [53.87548007, 27.520386430000002],
          [53.87520112, 27.51986072],
          [53.87433253, 27.51832649],
          [53.87347661, 27.51682446],
          [53.872855259999994, 27.515730119999997],
          [53.87205004, 27.513992039999998],
          [53.87197395, 27.513777469999997],
          [53.872550929999996, 27.512715309999997],
          [53.87308966, 27.511781829999997],
          [53.873324249999996, 27.511867659999997],
          [53.87417384, 27.513444799999995]
        ], {
          balloonContent: 'Маршрут проезда'
        }, {
          balloonCloseButton: false,
          strokeColor: ['#000088', '#E63E92'],
          strokeWidth: [7, 2],
          strokeStyle: [0, 'dash'],
          strokeOpacity: [0.23, 1]
        }),
        mark = new ymaps.Placemark(
            [53.87417384, 27.513444799999995],
            {
              hintContent: "Надежные Руки"
            }, {
              iconLayout: 'default#image',
              iconImageHref: 'logo_64.png',
              iconImageSize: [30, 64],
              iconImageOffset: [-3, -65]
            }
        );

    myMap = new ymaps.Map('map', {
      center: [53.875099, 27.512741],
      zoom: 16,
      controls: ['zoomControl'],
      type: 'yandex#publicMap'
    });

    myMap.geoObjects.add(route).add(mark);
  });
};
