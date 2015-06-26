@SH.filter 'phoneLink', ->
  (phone) ->
    "tel:#{ phone.replace(/[^\+\d]/g, '') }"
