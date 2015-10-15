class HeadController
  constructor: ($scope, HeadService) ->
    $scope.title = -> HeadService.getTitle()

@SH.controller('HeadCtrl', ['$scope', 'HeadService', HeadController])
