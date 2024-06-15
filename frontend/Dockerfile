FROM node:lts-alpine

WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm i

RUN apk --update --no-cache add curl

COPY . ./

CMD npm run dev