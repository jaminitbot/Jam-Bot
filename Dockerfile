FROM node:lts as builder
WORKDIR /app
COPY . /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install
RUN pnpm build
RUN pnpm prune --prod

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
RUN npx prisma generate
CMD ["node", "dist/index.js"]
