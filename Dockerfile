FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./ /usr/src/app
ENV NODE_ENV production
RUN apk add git
RUN apk add python3
RUN yarn install
RUN yarn add typescript
RUN yarn tsc
RUN yarn start