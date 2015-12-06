require 'sinatra'
require 'active_record'
require 'action_mailer'
require 'pry'

require './mailer'

Dir['lib/**/*.rb'].each { |model_file| require "./#{ model_file }" }
Dir['models/**/*.rb'].each { |model_file| require "./#{ model_file }" }

Encoding.default_external = 'utf-8'

unless ActiveRecord::Base.connected?
  db_config = YAML::load(IO.read('./config/database.yml'))

  ActiveRecord::Base.establish_connection(db_config)
  ActiveRecord::Base.logger = Logger.new(STDOUT)
end

set :views, './'

ActionMailer::Base.view_paths = './views'

if false#Router.local?
  ActionMailer::Base.delivery_method = :file
  ActionMailer::Base.file_settings = { location: './tmp/emails' }
else
  ActionMailer::Base.smtp_settings = YAML::load(IO.read('./config/smtp.yml'))
end
