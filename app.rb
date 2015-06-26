# -*- encoding : utf-8 -*-

require './env'
require 'sprite_factory'
require 'pry'

get '*' do
  IO.write('public/index.html', slim(:app))

  views_public_dir = 'public/views'
  Dir.mkdir(views_public_dir) unless Dir.exist?(views_public_dir)

  Dir.glob("views/**/*.slim").each do |view_file_path|
    IO.write("#{ views_public_dir }/#{ File.basename(view_file_path, '.slim') }", Slim::Template.new(view_file_path).render(self))
  end

  IO.write('public/app.css', sass(:app, style: :compressed))

  IO.write(
      'public/app.js',
      #Uglifier.compile(
          CoffeeScript.compile(
              Dir.glob("js/**/*.coffee").map do |script_file_path|
                IO.read(script_file_path)
              end.join("\n")
          )
      #)
  )

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
