# config valid only for current version of Capistrano
lock '3.3.5'

server 'safehands.by', user: 'deployer'

set :application, 'safehands'
set :repo_url, 'git@github.com:alexyakubenko/safehands.git'

# Default value for :pty is false
# set :pty, true

set :linked_files, fetch(:linked_files, []).push('config/database.yml')

set :rvm_ruby_version, 'ruby-head@safehands'

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

after 'deploy:publishing', 'deploy:restart'

namespace :deploy do
  task :restart do
    invoke 'unicorn:reload'
  end
end
