#!/bin/sh

chown -R $UID:$GID /db /config
exec su-exec $UID:$GID /sbin/tini -- nikas -c /config/nikas.conf run
