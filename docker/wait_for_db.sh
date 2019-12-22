#! /bin/sh

until nc -z -v -w30 db 5432
do
  echo "Waiting for sw-db (db) container started..."
  sleep 1
done
echo "PostgreSQL is up and running"

RETRIES=30

until psql -h db -U postgres -c "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES)) remaining attempts..."
  RETRIES=$((RETRIES-=1))
  sleep 5
done
