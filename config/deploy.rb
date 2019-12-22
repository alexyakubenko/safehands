require 'bundler/capistrano'
require 'rvm/capistrano'
require 'capistrano-unicorn'

#server '54.93.249.107', :app, :db, primary: true
#set :user, 'deployer'

server '45.132.19.29', :app, primary: true
set :user, 'root'

set :rvm_ruby_string, 'ruby-2.5@safehands'
set :rvm_path, '/usr/share/rvm/'

set :application, 'safehands'
set :deploy_to, "/home/#{ user }/apps/#{ application }"
set :deploy_via, :remote_cache
set :use_sudo, false

set :scm, 'git'
set :repository, "git@github.com:alexyakubenko/#{ application }.git"
set :branch, 'master'

set :unicorn_pid, "#{ current_path }/tmp/pids/unicorn.pid"
set :normalize_asset_timestamps, false

default_run_options[:pty] = true
ssh_options[:forward_agent] = true

after 'deploy', 'deploy:cleanup' # keep only the last 5 releases

namespace :deploy do
  desc "restart unicorn server"
  task :restart, roles: :app, except: { no_release: true } do
    unicorn.duplicate
  end

  task :symlink_config, roles: :app do
    %w{
      twilio.yml
      smtp.yml
      credentials.yml
      database.yml
    }.each do |config_file_name|
      run "ln -nfs #{ shared_path }/config/#{config_file_name} #{ release_path }/config/#{config_file_name}"
    end
    run "ln -nfs #{ shared_path }/db #{ release_path }/tmp/db"
  end

  after 'deploy:finalize_update', 'deploy:symlink_config'
end
