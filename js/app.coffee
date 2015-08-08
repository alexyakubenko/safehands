@SH = angular.module('safeHandsApp', ['ngRoute'])

@SH.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode(enabled: true, requireBase: false)
  $routeProvider
  .when('/', templateUrl: 'views/home.html', controller: 'HomeCtrl')
  .when('/price/:service_key?/:car_key?', templateUrl: 'views/price.html', controller: 'PriceCtrl')
  .when('/request', templateUrl: 'views/request.html', controller: 'RequestCtrl')
  .otherwise(redirectTo: '/')
])
