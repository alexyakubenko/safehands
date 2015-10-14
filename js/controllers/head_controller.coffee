class HeadController
  constructor: ($scope, HeadService) ->
    $scope.headTitle = -> HeadService.getTitle()

@SH.controller('HeadCtrl', ['$scope', 'HeadService', HeadController])
