class ScheduleController
  constructor: ($scope) ->
    moment.locale 'ru'

    $scope.beforeRender = ($view, $dates, $leftDate, $upDate, $rightDate) =>
      for date in $dates
        date.selectable = false if date.past || @isPastTimeDate(date, $view)

  isPastTimeDate: (date, view) ->
    now = new Date
    viewStartValue = switch view
      when 'year' then Date.UTC(now.getFullYear(), 0, 0, 0, 0, 0)
      when 'month' then Date.UTC(now.getFullYear(), now.getMonth(), 0, 0, 0, 0)
      when 'day' then Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      when 'hour' then Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0)
      when 'minute' then Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0)
    date.utcDateValue < viewStartValue


@SH.controller('ScheduleCtrl', ['$scope', ScheduleController])
