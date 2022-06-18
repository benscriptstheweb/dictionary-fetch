# WEB APP
FROM node:14-alpine
WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json

RUN npm run build
