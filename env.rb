require 'sinatra'
require 'active_record'

Dir['lib/**/*.rb'].each { |model_file| require "./#{ model_file }" }
Dir['models/**/*.rb'].each { |model_file| require "./#{ model_file }" }

set :views, './'

Encoding.default_external = 'utf-8'

unless ActiveRecord::Base.connected?
  db_config = YAML::load(File.open(File.join(settings.root, 'config', 'database.yml')))

  ActiveRecord::Base.establish_connection(db_config)
  ActiveRecord::Base.logger = Logger.new(STDOUT)
end
