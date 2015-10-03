class ApplicationController
  constructor: ($scope) ->
    $scope.narrowWidth = -> window.getWindowSize()[0] < 500

@SH.controller('ApplicationCtrl', ['$scope', ApplicationController])
