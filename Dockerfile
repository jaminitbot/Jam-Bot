FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY . /app
RUN yarn install\
	&& yarn global add typescript
RUN tsc
CMD yarn start