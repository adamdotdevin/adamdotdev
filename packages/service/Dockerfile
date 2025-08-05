FROM oven/bun:latest

WORKDIR /app
RUN mkdir packages patches
COPY package.json ./
COPY packages/*/package.json ./packages/
COPY packages ./packages
COPY patches ./patches
COPY bun.lock .
RUN bun install
WORKDIR /app/packages/service
CMD bun run ./src/index.ts

# # stage 1: build
# FROM oven/bun:latest AS builder
#
# WORKDIR /app
# RUN mkdir packages patches
# COPY package.json ./
# COPY packages/*/package.json ./packages/
# COPY packages ./packages
# COPY patches ./patches
# COPY bun.lockb .
# RUN bun install
# COPY . .
#
# WORKDIR /app/packages/service
# RUN bun build ./src/index.ts --target=bun --outdir=./dist --sourcemap --external=@aws-sdk/client-iot-data-plane
#
# # stage 2: run
# FROM oven/bun:slim
#
# WORKDIR /app
# COPY --from=builder /app/packages/service/dist /app/dist
# RUN bun install @aws-sdk/client-iot-data-plane
#
# WORKDIR /app
# CMD ["bun", "run", "./dist/index.js"]
#
