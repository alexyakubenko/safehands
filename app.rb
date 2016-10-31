# -*- encoding : utf-8 -*-

require './env'
require 'sprite_factory'
require 'bootstrap-sass'
require 'socket'
#require 'sidekiq'

before do
  content_type :json
end
=begin
map '/sidekiq' do
  use Rack::Auth::Basic, "Protected Area" do |username, password|
    username == 'sidekiq' && password == 'sidekiq'
  end

  run Sidekiq::Web
end
=end

get '/reservations/?:prev?' do
  protected!

  content_type :html

  IO.write('public/reservations.css', sass(:reservations, style: :compressed))

  slim(:reservations)
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

get '/reservations/:id/change_status/:status_id' do
  reservation = Reservation.find(params[:id])
  reservation.status = params[:status_id]
  reservation.save

  redirect to('/reservations')
end

get '/reservations/:view/:time' do
  time = Time.at(params[:time].to_s.first(10).to_i).in_time_zone('UTC')

  reservation_times = case params[:view]
                        when 'hour'
                          real_time = time + 1.day
                          times = Reservation.where(time: real_time.beginning_of_day..real_time.end_of_day).pluck(:time)
                          times.select { |x| x.min.zero? && times.select { |y| y >= x && y <= x + 1.hour  }.size >= 4 }
                        when 'minute'
                          Reservation.where(time: time.beginning_of_hour..time.end_of_hour).pluck(:time)
                        else
                          []
                      end

  { reservations: reservation_times.map { |t| "#{ t.to_i }000".to_i } }.to_json
end

post '/sms_notification_report/:id' do
  notification = Rack::Utils.parse_nested_query(request.body.read)
  SMSNotification.find(params[:id]).sms_notification_reports.create(params: notification)
  status 200
end

get '*' do
  content_type :html

  views_public_dir = 'public/views'

  if !Dir.exist?(views_public_dir) || local?
=begin
    Dir.glob('views/templates/**/*.slim').each do |view_file_path|
      view_dir = File.join(views_public_dir, view_file_path.split('/')[2..-2])
      view_file = File.basename(view_file_path, '.slim')
      FileUtils.mkdir_p(view_dir) unless Dir.exist?(view_dir)
      IO.write(File.join(view_dir, view_file), Slim::Template.new(view_file_path).render(self))
    end
=end
    IO.write('public/index.html', slim(:app))

    IO.write('public/app.css', sass(:app, style: :compressed))

    app_js_content = Dir.glob('js/**/*.js.erb').sort.map do |script_file_path|
      Erubis::Eruby.new(IO.read(script_file_path)).result
    end.join("\n")

    app_js_content += CoffeeScript.compile(
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

  def protected!
    return if authorized?
    headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
    halt 401, "Not authorized\n"
  end

  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == YAML.load(IO.read('config/credentials.yml'))
  end
end
