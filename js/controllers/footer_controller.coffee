class FooterController
  constructor: ($scope) ->
    $scope.hideScheduleButton = -> window.location.pathname == '/schedule'

@SH.controller('FooterCtrl', ['$scope', FooterController])
