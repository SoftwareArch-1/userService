FROM node:16-alpine

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn

COPY . .

RUN npx prisma generate

RUN yarn build

CMD ["yarn", "start"]