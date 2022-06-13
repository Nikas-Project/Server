FROM alpine:3.16.0

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

RUN apk upgrade --no-cache \
    && apk add --no-cache -t build-dependencies \
    gcc \
    musl-dev \
    libffi-dev \
    python3 \
    python3-dev \
    py3-pip \
    sqlite \
    openssl \
    openssl-dev \
    ca-certificates \
    && pip3 install --upgrade --no-cache --no-cache-dir --ignore-installed pip wheel \
    && pip3 install --no-cache --no-cache-dir --ignore-installed nikas==$VERSION \
    && apk del build-dependencies \
    && rm -rf /tmp/* \
    && rm -rf /var/cache/apk/*

EXPOSE 8080

VOLUME /db /config

CMD ["nikas", "-c", "/config/nikas.conf", "run"]
