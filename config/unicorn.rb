root = '/home/deployer/apps/safehands/current'
working_directory root
pid "./tmp/pids/unicorn.pid"
stderr_path "#{ root }/log/unicorn_out.log"
stdout_path "#{ root }/log/unicorn_err.log"

listen '/tmp/unicorn.safehands.sock'
worker_processes 4
timeout 30

preload_app true

after_fork do |server, worker|
  db_config = YAML::load(File.open(File.join(Dir.pwd, 'config', 'database.yml')))
  ActiveRecord::Base.establish_connection(db_config)
end

before_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
  end

  old_pid = "#{ server.config[:pid] }.oldbin"
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill('QUIT', File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end
end
