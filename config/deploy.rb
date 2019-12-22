#server '54.93.249.107', :app, :db, primary: true
#set :user, 'deployer'

server '45.132.19.29', :app, primary: true
set :user, 'root'

set :application, 'safehands'
set :deploy_to, "/home/#{ user }/apps/#{ application }"
set :deploy_via, :remote_cache
set :use_sudo, false

set :scm, 'git'
set :repository, "git@github.com:alexyakubenko/#{ application }.git"
set :branch, 'master'

set :normalize_asset_timestamps, false

default_run_options[:pty] = true
ssh_options[:forward_agent] = true

after 'deploy', 'deploy:cleanup' # keep only the last 5 releases

namespace :deploy do
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
