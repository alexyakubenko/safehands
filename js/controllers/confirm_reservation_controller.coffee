class ConfirmReservationController
  constructor: ($scope, $http, AuthService) ->
    $scope.user = {}

    $scope.confirm = ->
      $scope.reservation_time = $scope.$parent.data.previousViewDate.display
      $scope.$parent.data.previousViewDate.selectable = false
      $scope.success = true

      $http.post(
        '/reservation',
          time: $scope.data.utc_date_value,
          name: $scope.user.name,
          phone: $scope.user.phone,
          email: $scope.user.email
      ).then ->
        AuthService.setReservation(
          $scope.user,
          $scope.data.utc_date_value
        )

@SH.controller('ConfirmReservationCtrl', ['$scope', '$http', 'AuthService', ConfirmReservationController])
