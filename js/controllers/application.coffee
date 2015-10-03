class ApplicationController
  constructor: ($scope) ->
    $scope.narrowWidth = -> window.getWindowSize()[0] < 1000

@SH.controller('ApplicationCtrl', ['$scope', ApplicationController])
