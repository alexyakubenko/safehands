class HomeController
  constructor: ($scope, HeadService) ->
    HeadService.setTitle('Шиномонтаж «Надежные Руки». Минск. Авторынок Малиновка.')

@SH.controller('HomeCtrl', ['$scope', 'HeadService', HomeController])
