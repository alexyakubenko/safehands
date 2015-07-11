class FooterController
  constructor: ($scope) ->
    $scope.hideRequestButton = ->
      window.location.pathname == '/request'

@SH.controller('FooterCtrl', ['$scope', FooterController])
