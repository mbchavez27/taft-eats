# Stage 1: Install ALL dependencies and build
FROM node:20-alpine AS build-env
WORKDIR /app

# 1. Copy ONLY package files (This layer is cached!)
COPY package.json package-lock.json ./

# 2. Install dependencies (This only runs if package.json changes)
RUN npm ci

# 3. Copy the rest of your source code
COPY . .

# 4. Build the React Router v7 app
RUN npm run build

# Stage 2: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Copy the built app and the serve dependencies
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/package.json /app/package-lock.json ./

# Install ONLY production dependencies for the runner
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]