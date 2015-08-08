class PriceController
  constructor: ($scope, $routeParams) ->
    $scope.prices = {
      shinomontazh: {
        name: 'Шиномонтаж'
        prices: {
          legkovoi: { name: 'Легковое авто' }
          miniven: { name: 'Минивэн' },
          jeep: { name: 'Внедорожник' },
          microavtobus: { name: 'Микроавтобус' },
          gruzovik: { name: 'Грузовой авто' }
        },
      },
      polirovka: {
        name: 'Полировка',
        prices: {
          legkovoi: { name: 'Легковое авто' }
          miniven: { name: 'Минивэн' },
          jeep: { name: 'Внедорожник' },
          microavtobus: { name: 'Микроавтобус' }
        }
      }
    }

    $scope.active_service_key = $routeParams.service_key
    $scope.active_car_key = $routeParams.car_key

@SH.controller('PriceCtrl', ['$scope', '$routeParams', PriceController])
