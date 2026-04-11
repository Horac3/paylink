# Stage 1: Builder (full devDependencies for nest build)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Production — only runtime deps (smaller image & lower RSS on 4GB hosts)
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
# Cap V8 heap so Node does not starve Postgres/Redis/other containers on small VPS
ENV NODE_OPTIONS=--max-old-space-size=384

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
