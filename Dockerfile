FROM public.ecr.aws/maxird/bun:1-arm64 as base
WORKDIR /usr/src/app

FROM base as install
COPY . .
RUN bun install --frozen-lockfile --ignore-scripts

# run the app
USER  bun
EXPOSE 4000/tcp
ENTRYPOINT [ "bun", "run", "dev" ]
