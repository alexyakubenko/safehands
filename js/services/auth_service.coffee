@SH.service('AuthService', [ ->
  user = null
  reservation_time = null

  setReservation: (user, reservation_time) ->
    @user = user
    @reservation_time = reservation_time

  hasReservation: ->
    !!@reservation_time
])
