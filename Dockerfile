FROM alpine:latest

ENV GID=1000 UID=1000

RUN apk upgrade --no-cache \
 && apk add -t build-dependencies \
    python3-dev \
    libffi-dev \
    build-base \
 && apk add \
    python3 \
    py3-pip \
    sqlite \
    openssl \
    openssl-dev \
    ca-certificates \
    su-exec \
    tini \
 && pip3 install --upgrade --ignore-installed pip wheel setuptools \
 && pip3 install --no-cache --ignore-installed wheel nikas \
 && apk del build-dependencies \
 && rm -rf /tmp/* /var/cache/apk/*

COPY run.sh /usr/local/bin/run.sh

RUN chmod +x /usr/local/bin/run.sh

EXPOSE 8080

VOLUME /db /config

LABEL maintainer="Arash Hatami <hatamiarash7@gmail.com>"

CMD ["run.sh"]
