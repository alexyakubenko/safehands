class HeaderController
  constructor: ($scope) ->
    $scope.contacts = [
      { name: null,   vk_url: '', phone: '+375 (44) 574 22 93', gsm: 'velcom' }
    ]

    $scope.isHomePage = ->
      window.location.pathname == '/'

    $scope.isTirePage = ->
      window.location.pathname.indexOf('/price/tires') is 0

    $scope.isRepairPage = ->
      window.location.pathname.indexOf('/price/repair') is 0

@SH.controller('HeaderCtrl', ['$scope', HeaderController])
