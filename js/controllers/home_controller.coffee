class HomeController
  constructor: ($scope, HeadService) ->
    HeadService.setTitle('Шиномонтаж «Надежные Руки». Центр Минска, Харьковская, метро Кальварийская.')

@SH.controller('HomeCtrl', ['$scope', 'HeadService', HomeController])
