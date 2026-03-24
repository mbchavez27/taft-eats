# Stage 1: Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copy package files (Cached Layer)
COPY package*.json ./
# Install ALL dependencies (including devDeps for the build)
RUN npm ci

# 2. Copy source and build (Cached Layer unless code changes)
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 3. Optimization: Only install production dependencies here
COPY package*.json ./
RUN npm ci --omit=dev

# 4. Copy ONLY the built files and the db folder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

EXPOSE 3000

# Using node directly is fine for Docker
CMD ["node", "dist/server.js"]