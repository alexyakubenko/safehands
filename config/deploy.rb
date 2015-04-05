require 'bundler/capistrano'
require 'rvm/capistrano'
require 'capistrano-unicorn'

server 'safehands.by', :app, :db, primary: true
set :user, 'deployer'

set :rvm_ruby_string, 'ruby-2.2.0@safehands'
set :rvm_type, :system
set :rvm_path, "/home/#{ user }/.rvm"

set :application, 'safehands'
set :deploy_to, "/home/#{ user }/apps/#{ application }"
set :deploy_via, :remote_cache
set :use_sudo, false

set :scm, 'git'
set :repository, "git@github.com:alexyakubenko/#{ application }.git"
set :branch, 'master'

default_run_options[:pty] = true
ssh_options[:forward_agent] = true

after 'deploy', 'deploy:cleanup' # keep only the last 5 releases

namespace :deploy do
  %w[start stop restart].each do |command|
    desc "#{ command } unicorn server"
    task command, roles: :app, except: { no_release: true } do
      unicorn.send(command)
    end
  end

  task :symlink_config, roles: :app do
    run "ln -nfs #{ shared_path }/config/database.yml #{ release_path }/config/database.yml"
  end

  after 'deploy:finalize_update', 'deploy:symlink_config'
end

namespace :nginx do
  %w[start stop restart reload].each do |command|
    desc "#{ command }ing nginx"
    task command, roles: :app, except: { no_release: true } do
      run "service nginx #{ command }"
    end
  end
end
