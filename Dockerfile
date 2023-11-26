FROM node:20-alpine3.18

RUN apk add yarn
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY --chown=node:node . .

USER node
RUN yarn && yarn tsc

USER node
EXPOSE 3000
CMD [ "node", "dist/app/index.js" ]
