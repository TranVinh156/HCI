# ---- Stage 1: build the React SPA ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps using lockfile for reproducible builds
COPY package.json package-lock.json* ./
RUN npm install

# Build
COPY . .
# VITE_API_URL is read at build time by Vite; pass it via --build-arg if needed
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve with nginx ----
FROM nginx:1.27-alpine

# SPA-friendly nginx config (fallback to index.html for client-side routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# react-router build outputs to build/client when ssr:false
COPY --from=builder /app/build/client /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
