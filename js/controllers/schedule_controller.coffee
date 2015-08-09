class ScheduleController
  constructor: ($scope) ->
    moment.locale 'ru'

    $scope.beforeRender = ($view, $dates, $leftDate, $upDate, $rightDate) =>
      switch $view
        when 'year' then ''
        when 'month'
          $upDate.selectable = false
        when 'day' then ''
        when 'hour' then ''
      console.log $upDate
@SH.controller('ScheduleCtrl', ['$scope', ScheduleController])
