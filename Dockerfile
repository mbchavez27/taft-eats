# Use Node.js Alpine
FROM node:20-alpine

WORKDIR /app

# Copy root package.json
COPY package*.json ./
RUN npm install

# Copy both client and server
COPY ./client ./client
COPY ./server ./server

# Install client and server dependencies
RUN npm --prefix client install
RUN npm --prefix server install

# Expose ports
EXPOSE 5173 3000

# Run both dev servers
CMD ["npm", "run", "dev"]