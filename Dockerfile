# WEB APP
FROM node:latest
WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

COPY ./src ./src
COPY ./public ./public
COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts

RUN npm install
RUN npm run build
