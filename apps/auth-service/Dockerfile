# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the root package.json and package-lock.json
COPY ../../package*.json ./

# All Copy for project
COPY . .

# Install dependencies using npm workspaces
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev", "user-service"]
