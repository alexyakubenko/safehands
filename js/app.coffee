@SH = angular.module('safeHandsApp', ['ngRoute'])

@SH.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode(enabled: true, requireBase: false)
  $routeProvider
  .when('/', templateUrl: 'views/home.html', controller: 'HomeCtrl')
  .when('/about', templateUrl: 'views/about.html', controller: 'AboutCtrl')
  .otherwise(redirectTo: '/')
])
