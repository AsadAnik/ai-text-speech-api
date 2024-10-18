# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the root package.json and package-lock.json
COPY ../../package*.json ./

# Copy the entire monorepo (to access workspaces and shared dependencies)
COPY ../../ .

# Install dependencies using npm workspaces
RUN npm install

# Build only the User Service workspace
RUN npm run build user-service

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist/apps/user-service ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]
