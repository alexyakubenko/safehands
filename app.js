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
    var mark = new ymaps.Placemark(
            [53.904941, 27.52385], {
              iconContent: 'Надежные Руки',
              hintContent: 'Шиномонтаж, СТО, Полировка, Химчистка',
              balloonContentHeader: 'ООО «Надежные Руки»',
              balloonContentBody: 'СТО, Шиномонтаж, Полировка, Химчистка',
              balloonContentFooter: 'г. Минск, ул. Харьковская 2А'
            }, {
              preset: 'islands#blueStretchyIcon'
            }
        ),

        polyLine = new ymaps.Polyline([
          [53.90600409, 27.52183597],
          [53.90583304, 27.52313416],
          [53.90561764, 27.52353113],
          [53.904941, 27.52385]
        ], {
          hintContent: 'Проезд по стоянке грузовиков'
        }, {
          strokeColor: ['#000088', '#E63E92'],
          strokeWidth: [7, 2],
          strokeStyle: [0, 'dash'],
          strokeOpacity: [0.23, 1]
        });

    myMap = new ymaps.Map('map', {
      center: [53.907565, 27.526196],
      zoom: 16,
      controls: ['zoomControl'],
      type: 'yandex#map'
    });

    myMap.geoObjects.add(mark);

    myMap.controls.add(new ymaps.control.TypeSelector(), { position: { top: 128, right: 20 } });

    mark.events.add('mouseenter', function (e) {
      e.get('target').options.set('preset', 'islands#greenStretchyIcon');
    }).add('mouseleave', function (e) {
      e.get('target').options.set('preset', 'islands#blueStretchyIcon');
    });

    ymaps.route([
      '53.90551627, 27.53785000',
      '53.90600409, 27.52183597'
    ], {
      multiRoute: true
    }).then(function(route) {
      var gatesWayPoint = route.getWayPoints().get(1);
      ymaps.geoObject.addon.hint.get(gatesWayPoint);
      gatesWayPoint.options.set({
        hintContentLayout: ymaps.templateLayoutFactory.createClass('Въезд под шлагбаум')
      });

      myMap.geoObjects.add(route).add(polyLine);
    });
  });
};
