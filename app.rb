# -*- encoding : utf-8 -*-

require './env'
require 'sprite_factory'
require 'bootstrap-sass'
require 'socket'
require 'pry'

before do
  content_type :json
end

post '/reservation' do
  time = Time.at(body_params[:time].to_s.first(10).to_i).in_time_zone('UTC')

  reservation = Reservation.new(
      time: time,
      name: body_params[:name],
      phone: body_params[:phone],
      email: body_params[:email]
  )

  { success: !!reservation.save }.to_json
end

get '/reservations/:view/:time' do
  time = Time.at(params[:time].to_s.first(10).to_i).in_time_zone('UTC')

  if params[:view] == 'minute'
    times = Reservation.where(time: time.beginning_of_hour..time.end_of_hour).pluck(:time)
    reservation_time_stamps = times.map { |t| "#{ t.to_i }000".to_i }

    { reservations: reservation_time_stamps }.to_json
  else
    { reservations: [] }.to_json
  end
end

post '/sms_notification_report/:id' do
  binding.pry

  SMSNotification.find(params[:id]).sms_notification_reports.create(params: body_params)

  status 200
end

get '*' do
  content_type :html

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

def body_params
  @body_params ||= JSON.parse(request.body.read).symbolize_keys
end

helpers do
  def local?
    Router.local?
  end
end
