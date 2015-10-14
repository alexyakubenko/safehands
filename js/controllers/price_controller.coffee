class PriceController
  constructor: ($scope, $routeParams, HeadService) ->
    $scope.prices = {
      tires: {
        name: 'шиномонтаж'
        prices: {
          light: { name: 'Легковое авто / Минивэн' }
          medium: { name: 'Внедорожник / Микроавтобус' },
          heavy: { name: 'Грузовой авто' },
          special: { name: 'Сельхозтехника' }
        },
      },
      repair: {
        name: 'ремонт шин',
        prices: {
          light: { name: 'Легковые шины' }
          heavy: { name: 'Грузовые шины' },
          special: { name: 'Шины от сельхозтехники' },
        }
      }
    }

    $scope.active_service_key = $routeParams.service_key
    $scope.active_car_key = $routeParams.car_key

    HeadService.setTitle("Шиномонтаж «Надежные Руки» Минск. Цены на услугу #{ $scope.prices[$routeParams.service_key].name } для #{ $scope.prices[$routeParams.service_key].prices[$routeParams.car_key].name }")

    $scope.header = () ->
      if $scope.active_service_key
        "Цены на #{ $scope.prices[$scope.active_service_key].name }"
      else
        'Цены'

@SH.controller('PriceCtrl', ['$scope', '$routeParams', 'HeadService', PriceController])
