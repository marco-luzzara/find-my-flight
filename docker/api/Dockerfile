# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /usr/src/app

ENV NODE_ENV=production

EXPOSE 80

# ******************************************

FROM base AS devcontainer

RUN apt update && apt install -y make

ENV NODE_ENV=development

USER node

# ******************************************

FROM base AS builder

USER node

COPY . .

RUN <<EOF
    cd packages/api
    npm ci --include=dev
    npm run build
EOF

# ******************************************

FROM base AS prod

USER node

COPY . .

RUN <<EOF
    cd packages/api
    npm ci --omit=dev
    mkdir -p dist
EOF

COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist

ENTRYPOINT ["node", "./packages/api/dist/index.js"]