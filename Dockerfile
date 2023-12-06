FROM --platform=linux/amd64 oven/bun:1 as base
WORKDIR /user/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
COPY package.json .
COPY bun.lockb .
RUN bun install --frozen-lockfile --ignore-scripts 

#FROM Build in Dev stage
COPY aws aws
COPY src src
COPY tsconfig.json .
CMD ["bun", "run", "src/server.ts"]


# copy production dependencies and source code into final image
