require 'sinatra'

env = ENV['RACK_ENV'] || ENV['RAILS_ENV'] || 'development'

unless ActiveRecord::Base.connected?
  db_config = YAML::load(File.open(File.join(settings.root, 'config', 'database.yml')))[env]

  ActiveRecord::Base.establish_connection(db_config)
  ActiveRecord::Base.logger = Logger.new(STDOUT)
end
