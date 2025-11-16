# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /usr/src/app

EXPOSE 80

# ******************************************

FROM base AS devcontainer

RUN apt update && apt install -y make git-all

ENV NODE_ENV=development

USER node

# ******************************************

FROM base AS builder

USER node

COPY . .

RUN <<EOF
    npm ci --include=dev --workspace="packages/api" --include-workspace-root=true
    cd packages/api && npm run build
EOF

# ******************************************

FROM base AS prod

ENV NODE_ENV=production

USER node

COPY . .

RUN <<EOF
    npm ci --omit=dev --workspace="packages/api" --include-workspace-root=true
    mkdir -p packages/api/dist
EOF

COPY --from=builder /usr/src/app/packages/api/dist ./packages/api/dist

ENTRYPOINT ["node", "./packages/api/dist/index.js"]