FROM node:lts
WORKDIR /app
COPY . /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install && pnpm install -g typescript --no-optional
RUN tsc
RUN rm -r node_modules
RUN NODE_ENV=production pnpm install
RUN npx prisma generate
CMD pnpm start
