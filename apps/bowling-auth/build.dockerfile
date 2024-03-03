ARG NODE_ENV=production

FROM node AS build

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ../../package*.json ./

RUN npm install -g pnpm @antfu/ni
RUN npm install typescript -g
RUN pnpm install

COPY . .

RUN pnpm run build bowling-auth

FROM node:alpine AS production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ../../package*.json ./

RUN npm install -g pnpm @antfu/ni
RUN pnpm install --only=production

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/apps/bowling-auth/main.js"]