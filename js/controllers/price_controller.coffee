class PriceController
  constructor: ($scope, $routeParams) ->
    $scope.prices = {
      tires: {
        name: 'шиномонтаж'
        prices: {
          light: { name: 'Легковое авто / Минивэн' }
          medium: { name: 'Внедорожник / Микроавтобус' },
          heavy: { name: 'Грузовой авто' }
        },
      },
      repair: {
        name: 'ремонт шин',
        prices: {
          light: { name: 'Легковые шины' }
          #heavy: { name: 'Грузовые шины' },
          #special: { name: 'Сельскохозяйственная техника' },
        }
      }
    }

    $scope.active_service_key = $routeParams.service_key
    $scope.active_car_key = $routeParams.car_key

    $scope.header = () ->
      if $scope.active_service_key
        "Цены на #{ $scope.prices[$scope.active_service_key].name }"
      else
        'Цены'

@SH.controller('PriceCtrl', ['$scope', '$routeParams', PriceController])
