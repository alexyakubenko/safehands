class FooterController
  constructor: ($scope, AuthService) ->
    $scope.hideReservationButton = -> window.location.pathname == '/reservation' or AuthService.hasReservation()

@SH.controller('FooterCtrl', ['$scope', 'AuthService', FooterController])
