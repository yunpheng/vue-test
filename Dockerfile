FROM node

LABEL maintainer="yangfeng"

ENV APP_HOME /app

WORKDIR $APP_HOME

COPY ./ $APP_HOME

RUN set -x && echo "\n======================\n" \
    && pwd && ls

RUN set -x && npm -g install nrm && \
    nrm add taobao https://registry.npm.taobao.org && \
    nrm use taobao

# RUN npm install pm2 -g

RUN set -x && npm install

RUN set -x && echo "\n======================\n" && \
    npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
