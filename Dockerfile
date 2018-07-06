# Angular and Meteor - The perfect stack https://www.angular-meteor.com/
#
# Author: Georgy Berdyshev
#

FROM ubuntu:bionic

RUN apt-get update && apt-get dist-upgrade -y && \
    apt-get install -y software-properties-common && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    git \
    apt-transport-https \
    curl

RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

RUN apt-get update && apt-get -y install google-chrome-stable --no-install-recommends

RUN apt-get -y install phantomjs --no-install-recommends

RUN useradd -ms /bin/bash docker

USER docker

WORKDIR /home/docker

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

ENV NVM_DIR=/home/docker/.nvm

RUN . $NVM_DIR/nvm.sh && nvm install --lts && \
    nvm use --lts && \
    npm install -g npm@latest && \
    npm --version

RUN curl https://install.meteor.com | /bin/sh

ENV PATH="/home/docker/.meteor:${PATH}"

RUN meteor --version
