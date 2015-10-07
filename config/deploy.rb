require 'bundler/capistrano'
require 'rvm/capistrano'
require 'capistrano-unicorn'

#server 'safehands.by', :app, :db, primary: true
server '178.124.143.3', :app, :db, primary: true
set :user, 'deployer'

set :rvm_ruby_string, 'ruby-2.2.3@safehands'
set :rvm_type, :system
set :rvm_path, "/home/#{ user }/.rvm"

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
    run "ln -nfs #{ shared_path }/config/database.yml #{ release_path }/config/database.yml"
  end

  after 'deploy:finalize_update', 'deploy:symlink_config'
end
