FROM alpine:latest

ARG DATE_CREATED
ARG VERSION

LABEL maintainer="Arash Hatami <hatamiarash7@gmail.com>"
LABEL org.opencontainers.image.created=$DATE_CREATED
LABEL org.opencontainers.image.version=$VERSION
LABEL org.opencontainers.image.authors="hatamiarash7"
LABEL org.opencontainers.image.vendor="hatamiarash7"
LABEL org.opencontainers.image.title="Nikas"
LABEL org.opencontainers.image.description="The first Persian comment system"
LABEL org.opencontainers.image.source="https://github.com/Nikas-Project/Server"

ENV GID=1000 UID=1000

RUN apk upgrade --no-cache \
 && apk add --no-cache -t build-dependencies \
    libffi-dev \
    build-base \
    python3 \
    python3-dev \
    py3-pip \
    sqlite \
    openssl \
    openssl-dev \
    ca-certificates \
    su-exec \
    tini \
 && pip3 install --upgrade --no-cache --no-cache-dir --ignore-installed pip wheel setuptools \
 && pip3 install --no-cache --no-cache-dir --ignore-installed nikas==$VERSION \
 && apk del build-dependencies \
 && rm -rf /tmp/* \
 && rm -rf /var/cache/apk/*

COPY run.sh /usr/local/bin/run.sh

RUN chmod +x /usr/local/bin/run.sh

EXPOSE 8080

VOLUME /db /config

CMD ["run.sh"]
