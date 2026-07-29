# syntax=docker/dockerfile:1.7
FROM node:24.18.0-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build -- --configuration=production

FROM nginxinc/nginx-unprivileged:1.29.5-alpine

COPY --chown=101:101 default.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build --chown=101:101 /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --output-document=/dev/null http://127.0.0.1:8080/ || exit 1

USER 101
CMD ["nginx", "-g", "daemon off;"]
