@SH.service('HeadService', [ ->
  title = 'Шиномонтаж «Надежные Руки». Центр Минска, Харьковская, метро Кальварийская.'

  getTitle: ->
    title

  setTitle: (newTitle) ->
    title = newTitle
])
