# from pm2
# FROM keymetrics/pm2:latest-alpine
FROM node:10-alpine
# copy all folder
WORKDIR /usr/src/app
COPY package*.json ./
ENV NPM_CONFIG_LOGLEVEL verbose
RUN npm config set proxy http://proxy_host && \
    npm config set https-proxy http://proxy_host
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install
COPY . .
RUN npm run buildserver


EXPOSE 3000

CMD [ "npm", "run", "start" ]
