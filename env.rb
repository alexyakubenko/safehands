require 'sinatra'
require 'action_mailer'
require "sinatra/activerecord"

require './mailer'

Dir['lib/**/*.rb'].each { |model_file| require "./#{ model_file }" }
Dir['models/**/*.rb'].each { |model_file| require "./#{ model_file }" }

require 'pry' if Router.local?

Encoding.default_external = 'utf-8'

#unless ActiveRecord::Base.connected?
#  db_config = YAML::load(IO.read('./config/database.yml'))

#  ActiveRecord::Base.establish_connection(db_config)
#  ActiveRecord::Base.logger = Logger.new(STDOUT)
#end

register Sinatra::ActiveRecordExtension

ActiveRecord::Base.logger = Logger.new(STDOUT)
set :database, {
  adapter: "postgresql",
  url: ENV["DB_URL"]
}

set :views, './'

ActionMailer::Base.view_paths = './views'

if Router.local?
  ActionMailer::Base.delivery_method = :file
  ActionMailer::Base.file_settings = { location: './tmp/emails' }
else
  ActionMailer::Base.smtp_settings = YAML::load(IO.read('./config/smtp.yml'))
end
