class PriceController
  constructor: ($scope, $routeParams) ->
    $scope.prices = {
      shinomontazh: {
        name: 'Шиномонтаж'
        prices: {
          legkovoi: { name: 'Легковое авто' }
          miniven: { name: 'Минивэн' },
          jeep: { name: 'Внедорожник' },
          microavtobus: { name: 'Микроавтобус' }
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

    $scope.active_service_key = $routeParams.service
    $scope.active_car_key = $routeParams.car

@SH.controller('PriceCtrl', ['$scope', '$routeParams', PriceController])
