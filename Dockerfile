# Stage 1: Build the app
FROM node:14-alpine AS builder

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app
FROM node:14-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app ./

# Install production dependencies only
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "start"]
