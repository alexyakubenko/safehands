@SH.service('HeadService', [ ->
  title = 'Шиномонтаж «Надежные Руки». Минск. Авторынок Малиновка.'

  getTitle: ->
    title

  setTitle: (newTitle) ->
    title = newTitle
])
