class HeaderController
  constructor: ($scope) ->
    $scope.contacts = [
      { name: 'Александр', vk_url: 'https://vk.com/id218785045', phone: '+375 (29) 574 22 95', gsm: 'mts' },
      { name: 'Алексей',   vk_url: 'https://vk.com/id143235044', phone: '+375 (29) 672 91 69', gsm: 'velcom' }
    ]

    $scope.isHomePage = ->
      window.location.pathname == '/'

    $scope.isTirePage = ->
      window.location.pathname.indexOf('/price/tires') is 0

    $scope.isRepairPage = ->
      window.location.pathname.indexOf('/price/repair') is 0

@SH.controller('HeaderCtrl', ['$scope', HeaderController])
