FROM node:lts
WORKDIR /app
COPY . /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install && pnpm install -g typescript
RUN tsc
RUN pnpm prisma generate
RUN pnpm prune --prod
CMD pnpm start
