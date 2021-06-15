FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app
ENV NODE_ENV production
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm tsc
RUN pnpm start