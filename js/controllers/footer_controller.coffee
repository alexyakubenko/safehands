class FooterController
  constructor: ($scope) ->
    $scope.hideScheduleButton = -> true# window.location.pathname == '/schedule'

@SH.controller('FooterCtrl', ['$scope', FooterController])
