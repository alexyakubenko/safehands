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
              iconContent: 'Шиномонтаж "Надежные Руки"',
              hintContent: 'г. Минск, ул. Харьковская 2А',
              balloonContentHeader: 'ООО',
              balloonContentBody: 'Надежные Руки',
              balloonContentFooter: 'СТО, Шиномонтаж, Полировка, Химчистка'
            }, {
              preset: 'islands#blueStretchyIcon'
            }
        );

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
      ymaps.geoObject.addon.balloon.get(gatesWayPoint);
      gatesWayPoint.options.set({
        iconContentLayout: ymaps.templateLayoutFactory.createClass('Въезд под шлагбаум')
      });
      myMap.geoObjects.add(route);
    });
  });
};
