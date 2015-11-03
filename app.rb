# -*- encoding : utf-8 -*-

require './env'
require 'sprite_factory'
require 'bootstrap-sass'
require 'socket'
require 'pry'

post '/schedule' do
  content_type :json

  params_hash = JSON.parse(request.body.read)

  { time_stamp: Time.at(params_hash['time_stamp'].to_s.first(10).to_i).in_time_zone('GMT').inspect }.to_json
end

get '*' do
  views_public_dir = 'public/views'

  if !Dir.exist?(views_public_dir) || local?
    Dir.glob('views/templates/**/*.slim').each do |view_file_path|
      view_dir = File.join(views_public_dir, view_file_path.split('/')[2..-2])
      view_file = File.basename(view_file_path, '.slim')
      FileUtils.mkdir_p(view_dir) unless Dir.exist?(view_dir)
      IO.write(File.join(view_dir, view_file), Slim::Template.new(view_file_path).render(self))
    end

    IO.write('public/index.html', slim(:app))

    IO.write('public/app.css', sass(:app, style: :compressed))

    app_js_content = CoffeeScript.compile(
        Dir.glob('js/**/*.coffee').sort.map do |script_file_path|
          IO.read(script_file_path)
        end.join("\n")
    )

    app_js_content = Uglifier.compile(app_js_content) unless local?

    IO.write('public/app.js', app_js_content)

    (Dir.glob('js/**/*.js') + Dir.glob('css/**/*.css')).map do |script_file_path|
      js_dir = "public/#{ File.dirname(script_file_path) }"

      FileUtils.mkdir_p(js_dir) unless Dir.exist?(js_dir)
      FileUtils.cp(script_file_path, "public/#{ script_file_path }")
    end

    phonts_dir = 'public/fonts'
    FileUtils.mkdir_p(phonts_dir) unless Dir.exist?(phonts_dir)
    FileUtils.copy_entry("#{ Bootstrap.assets_path }/fonts", phonts_dir)

    SpriteFactory.run!(
        'icons',
        library: :chunkypng,
        layout: :packed,
        selector: '.icon-',
        output_image: 'public/sprite.png',
        output_style: 'public/sprite.css'
    )

    FileUtils.cp('favicon.ico', 'public/favicon.ico')
  end

  IO.read('public/index.html')
end

helpers do
  def local?
    Socket.gethostname == 'Alexandrs-MacBook-Pro.local'
  end
end
