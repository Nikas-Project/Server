# First, compile JS stuff
FROM node:dubnium-buster
WORKDIR /src/
COPY . .
RUN npm install -g requirejs uglify-js jade bower \
 && make init js

# Second, create virtualenv
FROM python:3.8.3-buster
WORKDIR /src/
COPY --from=0 /src .
RUN python3 -m venv /nikas \
 && . /nikas/bin/activate \
 && pip3 install --no-cache-dir --upgrade pip \
 && pip3 install --no-cache-dir gunicorn cffi flask \
 && python setup.py install \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Third, create final repository
FROM python:3.8.3-slim-buster
WORKDIR /nikas/
COPY --from=1 /nikas .

# Configuration
VOLUME /db /config
EXPOSE 8080
ENV NIKAS_SETTINGS /config/nikas.cfg
CMD ["/nikas/bin/gunicorn", "-b", "0.0.0.0:8080", "-w", "4", "--preload", "nikas.run", "--worker-tmp-dir", "/dev/shm"]

# Example of use:
#
# docker build -t nikas .
# docker run -it --rm -v /opt/nikas:/config -v /opt/nikas:/db -v $PWD:$PWD nikas /nikas/bin/nikas -c \$NIKAS_SETTINGS import disqus.xml
# docker run -d --rm --name nikas -p 8080:8080 -v /opt/nikas:/config -v /opt/nikas:/db nikas
