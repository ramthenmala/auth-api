FROM node:18 AS base

RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM dependencies AS dev
WORKDIR /app
COPY . .
RUN cp -a /app/node_modules /app/
CMD ["pnpm", "run", "dev"]

FROM dependencies AS prod
WORKDIR /app
COPY . .
RUN pnpm run build
CMD ["node", "build/src/app.js"]
