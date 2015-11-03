class ConfirmScheduleController
  constructor: ($scope, $http) ->
    $scope.confirm = ->
      $http.post(
        '/schedule',
          time_stamp: $scope.data.utc_date_value,
          name: $scope.name,
          phone: $scope.phone,
          email: $scope.email
      ).then (response) ->
        console.log(response.data)

@SH.controller('ConfirmScheduleCtrl', ['$scope', '$http', ConfirmScheduleController])
