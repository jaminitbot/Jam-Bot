FROM node:lts
WORKDIR /app
COPY . /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install
RUN pnpm tsc
RUN pnpm prisma generate
RUN pnpm prune --prod
CMD pnpm start
