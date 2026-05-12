# =========================================================
# Base dependencies
# =========================================================
FROM node:24.15.0-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest \
  && npm ci


# =========================================================
# Builder
# =========================================================
FROM node:24.15.0-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ---------------------------------------------------------
# Build arguments
# ---------------------------------------------------------
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_ENV

# ---------------------------------------------------------
# Environment variables used during Next.js build
# ---------------------------------------------------------
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

# ---------------------------------------------------------
# Build application
# ---------------------------------------------------------
RUN npm run build


# =========================================================
# Production runner
# =========================================================
FROM node:24.15.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo

# ---------------------------------------------------------
# Runtime public envs
# ---------------------------------------------------------
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_ENV

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

# ---------------------------------------------------------
# Copy standalone build
# ---------------------------------------------------------
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# ---------------------------------------------------------
# Security
# ---------------------------------------------------------
USER node

# ---------------------------------------------------------
# Expose Next.js port
# ---------------------------------------------------------
EXPOSE 3000

# ---------------------------------------------------------
# Start Next.js standalone server
# ---------------------------------------------------------
CMD ["node", "server.js"]