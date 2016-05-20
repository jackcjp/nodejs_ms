#
# AUTHOR            Jpchen <jpchen@leadstec.com>
# DOCKER-VERSION    1.9.1
# Copyright         (C) 2015 Leads Technologies Ltd. All rights reserved.
#
# Description       Dockerfile for Nodejs MS base on nodejs
#
FROM       reg.leadstec.com/nodejs:latest
MAINTAINER Jpchen <jpchen@leadstec.com>
LABEL leadstec-nodejs_ms-build="0.1.0-{{PIPELINE_BUILD_NUMBER}}"

# install packages
RUN apk --update add make git nodejs && \
    rm /var/cache/apk/*

# install npm packages
COPY package.json ${APP_DIR}/package.json
RUN cd ${APP_DIR} && sudo -u node -H npm install
