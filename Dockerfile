FROM --platform=linux/amd64 oven/bun:1 as base
WORKDIR /usr/src/app

FROM base as install
COPY package.json .
COPY bun.lockb .
RUN bun install --production --frozen-lockfile  --ignore-scripts
COPY src src
COPY aws aws
COPY tsconfig.json .
COPY drizzle.config.ts .

# run the app
USER  bun
EXPOSE 4000/tcp
ENTRYPOINT [ "bun", "run", "dev" ]
