FROM ruby:3.1.2-alpine

RUN addgroup -S safehands \
  && adduser -S -D -s /bin/false -G safehands -g safehands safehands

# throw errors if Gemfile has been modified since Gemfile.lock
RUN echo "gem: --no-document" >> /etc/gemrc \
  && bundle config --global frozen 1 \
  && bundle config --global clean true \
  && bundle config --global disable_shared_gems false

RUN mkdir -p /app \
  && mkdir -p /app/tmp/pids /app/log \
  && touch app/log/unicorn_out.log \
  && chown -R safehands:safehands /app \
  && chmod 700 /app/
WORKDIR /app

RUN gem update --system \
  && gem install bundler:1.17.1 \
  && apk add --no-cache \
    curl \
    postgresql-dev \
    postgresql-client \
    nodejs

EXPOSE 8080

COPY ["Gemfile", "Gemfile.lock", "/app/"]

RUN apk add --no-cache --virtual build-dependencies build-base && \
    bundle install --clean --force && \
    apk del build-dependencies

COPY . /app

RUN chown -R safehands:safehands /app

USER safehands

HEALTHCHECK CMD curl --fail http://localhost:$PORT/ping || exit 1

#ENTRYPOINT ["docker/startup.sh"]

#CMD ["docker/run_web_server.sh"]
EXPOSE 4567
CMD bundle exec rackup --host 0.0.0.0 -p 4567