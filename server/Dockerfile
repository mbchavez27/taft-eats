# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Use install if you don't have a lockfile, otherwise ci is fine
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed to run
COPY package*.json ./
RUN npm install --omit=dev

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist
# If you have a db folder for migrations/seeds, copy it too
COPY --from=builder /app/db ./db 

EXPOSE 3000

# double-check if your main file is index.js or app.js!
CMD ["node", "dist/server.js"]
