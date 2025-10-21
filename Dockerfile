FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean


COPY . .
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]