FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:3000/api/v1
ARG VITE_IOS_APP_URL=https://apps.apple.com/app/paylink/id000000000
ARG VITE_ANDROID_APP_URL=https://play.google.com/store/apps/details?id=com.never9to5ive.paylink
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IOS_APP_URL=$VITE_IOS_APP_URL
ENV VITE_ANDROID_APP_URL=$VITE_ANDROID_APP_URL

ENV NODE_OPTIONS=--max-old-space-size=1536
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
