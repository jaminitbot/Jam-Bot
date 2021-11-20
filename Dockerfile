FROM node:lts
WORKDIR /app
COPY . /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN NODE_ENV=production pnpm install && pnpm install -g typescript
RUN tsc
CMD pnpm start
