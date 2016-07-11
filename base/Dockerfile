#
# AUTHOR            Jpchen <jpchen@example.com>
# DOCKER-VERSION    1.9.1
# Copyright         (C) 2015 example Technologies Ltd. All rights reserved.
#
# Description       Dockerfile for Nodejs MS base on nodejs
#
FROM       reg.lxxxxx.com/nodejs:latest
MAINTAINER Jpchen <jpchen@lxxxxx.com>
LABEL example-nodejs_ms-build="0.3.0-{{PIPELINE_BUILD_NUMBER}}"

# set environment variables
ENV NODEJS_MS_VERSION="0.3.0"

# install packages
RUN apk --update add make git nodejs && \
    rm /var/cache/apk/*

# install npm packages
COPY package.json ${APP_DIR}/package.json
RUN cd ${APP_DIR} && sudo -u node -H npm install
RUN npm install json-server@^0.8.14 -g

# copy dbconf code
COPY src ${APP_DIR}
