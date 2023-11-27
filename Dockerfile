FROM node:20-alpine3.18

RUN apk -U add --no-cache bash tini yarn iputils-ping

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY --chown=node:node . .

RUN yarn install && \
    yarn build

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
