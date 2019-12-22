#! /bin/sh

docker/wait_for_db.sh

exec "$@"
