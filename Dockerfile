FROM node:lts-alpine
FROM alphine-docker/git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./ /usr/src/app
ENV NODE_ENV production
RUN yarn install
RUN yarn tsc
RUN yarn start