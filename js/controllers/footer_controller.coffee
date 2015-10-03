class FooterController
  constructor: ($scope) ->
    $scope.hideRequestButton = -> true
    #window.location.pathname == '/request'

@SH.controller('FooterCtrl', ['$scope', FooterController])
