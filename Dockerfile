FROM node
MAINTAINER Max Friederichs "max@maxfriederichs.com"

ENV PORT 3000

# Clone the private repo
ADD id_rsa /root/.ssh/
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
RUN chmod 400 /root/.ssh/id_rsa
RUN git clone git@bitbucket.org:mfriederichs/pokebelt.git /root/pokebelt

# Install browserify
RUN npm install -g browserify

# Install deps
WORKDIR /root/pokebelt/public/js
RUN npm install

# Build assets
RUN browserify -t brfs app.js -o main.js

# Install python
RUN apt-get install -y python

# Entrypoint for application
WORKDIR /root/pokebelt/public
EXPOSE ${PORT}
CMD /usr/bin/python -m SimpleHTTPServer ${PORT}
