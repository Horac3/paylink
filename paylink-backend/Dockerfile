# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]