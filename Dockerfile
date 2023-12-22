FROM --platform=linux/amd64 public.ecr.aws/cutstomafk/bun:latest as base
WORKDIR /usr/src/app

FROM base as install
COPY . .
RUN echo "Run Docker"
RUN bun install --frozen-lockfile --ignore-scripts

# run the app
USER  bun
EXPOSE 4000/tcp
ENTRYPOINT [ "bun", "run", "dev" ]
