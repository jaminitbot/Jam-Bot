FROM node:lts as builder
WORKDIR /build
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm turbo run build
RUN pnpm run deploy

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
WORKDIR /app/deploy/packages/jam-bot
RUN npm install -g prisma
RUN prisma generate
CMD ["node", "dist/index.js"]
