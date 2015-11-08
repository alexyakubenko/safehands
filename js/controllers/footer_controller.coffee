class FooterController
  constructor: ($scope) ->
    $scope.hideReservationButton = -> window.location.pathname == '/reservation'

@SH.controller('FooterCtrl', ['$scope', FooterController])
