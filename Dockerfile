FROM node
MAINTAINER Max Friederichs "max@maxfriederichs.com"

ENV PORT 3000

ADD ./public /root

# Install browserify
RUN npm install -g browserify

# Install deps
WORKDIR /root/public/js
RUN npm install

# Build assets
RUN browserify -t brfs app.js -o main.js

# Install python
RUN apt-get install -y python

# Entrypoint for application
WORKDIR /root/public
EXPOSE ${PORT}
CMD /usr/bin/python -m SimpleHTTPServer ${PORT}

