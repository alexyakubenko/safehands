# -*- encoding : utf-8 -*-

require './env'
require 'sprite_factory'

get '/' do
  IO.write('public/index.html', slim(:app))
  IO.write('public/app.css', sass(:app, style: :compressed))
  IO.write('public/app.js', Uglifier.compile(CoffeeScript.compile(File.read('app.coffee'))))

  SpriteFactory.run!(
      'icons',
      library: :chunkypng,
      layout: :packed,
      selector: '.icon-',
      output_image: 'public/sprite.png',
      output_style: 'public/sprite.css'
  )

  IO.read('public/index.html')
end
