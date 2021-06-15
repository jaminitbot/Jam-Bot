FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./ /usr/src/app
RUN apk add git
RUN apk add python3
RUN yarn install
RUN yarn tsc
ENV NODE_ENV production
ARG DBNAME=${DBNAME}
ARG DEFAULTPREFIX=${DEFAULTPREFIX}
ARG DmChannel=${DmChannel}
ARG GuildLogChannel=${GuildLogChannel}
ARG MONGO_URL=${MONGO_URL}
ARG OWNERID=${OWNERID}
ARG OWNERNAME=${OWNERNAME}
ARG TWITCH_ROLE_ID=${TWITCH_ROLE_ID}
ARG pexelsApiKey=${pexelsApiKey}
ARG token=${token}
ARG twitchApiClientId=${twitchApiClientId}
ARG twitchApiSecret=${twitchApiSecret}
ARG twitchNotificationsChannel=${twitchNotificationsChannel}
ARG twitchNotificationsGuild=${twitchNotificationsGuild}
ARG twitchNotificationsUsername=${twitchNotificationsUsername}
ENV DBNAME=${DBNAME}
ENV DEFAULTPREFIX=${DEFAULTPREFIX}
ENV DmChannel=${DmChannel}
ENV GuildLogChannel=${GuildLogChannel}
ENV MONGO_URL=${MONGO_URL}
ENV OWNERID=${OWNERID}
ENV OWNERNAME=${OWNERNAME}
ENV TWITCH_ROLE_ID=${TWITCH_ROLE_ID}
ENV pexelsApiKey=${pexelsApiKey}
ENV token=${token}
ENV twitchApiClientId=${twitchApiClientId}
ENV twitchApiSecret=${twitchApiSecret}
ENV twitchNotificationsChannel=${twitchNotificationsChannel}
ENV twitchNotificationsGuild=${twitchNotificationsGuild}
ENV twitchNotificationsUsername=${twitchNotificationsUsername}