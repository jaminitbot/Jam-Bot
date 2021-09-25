FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY . /app
RUN yarn install\
	&& yarn global add typescript
RUN tsc
COPY .env /app/built/
CMD yarn start