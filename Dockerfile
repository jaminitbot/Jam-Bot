FROM node:16
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build
COPY .env /app/built/
CMD yarn start