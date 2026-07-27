# ─────────────────────────────────────────────────────────────
# Stage 1: Install dependencies (cached layer)
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

# ─────────────────────────────────────────────────────────────
# Stage 2: Build Angular application
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Re-use installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Production build (output: dist/todo-list/browser)
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3: Serve with Nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist/todo-list/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
