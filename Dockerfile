FROM node:lts as builder
WORKDIR /build
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install -g @microsoft/rush
COPY . .
RUN rush install
RUN rush build
RUN rush deploy
RUN mkdir /app
RUN cp -r /build/common/deploy /app

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
WORKDIR /app/deploy/packages/jam-bot
RUN npm install -g prisma
RUN prisma generate
CMD ["node", "dist/index.js"]
