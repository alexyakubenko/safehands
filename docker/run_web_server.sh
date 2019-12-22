#! /bin/sh

echo "RUNNING web server"
touch /app/log/unicorn_out.log
unicorn -c config/unicorn.rb & tail -f /app/log/unicorn_out.log
