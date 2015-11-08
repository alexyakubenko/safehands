class ConfirmReservationController
  constructor: ($scope, $http) ->
    $scope.confirm = ->
      $http.post(
        '/reservation',
          time: $scope.data.utc_date_value,
          name: $scope.name,
          phone: $scope.phone,
          email: $scope.email
      ).then (response) ->
        console.log(response.data)

@SH.controller('ConfirmReservationCtrl', ['$scope', '$http', ConfirmReservationController])
