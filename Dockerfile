# Stage 1: Build the application
FROM node:20.11.1-alpine AS builder

ARG MONGO_URI
ARG DB_NAME
ARG ALLOWED_ORIGINS
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG AZURE_STORAGE_CONNECTION_STRING

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /app

# Copy package manager lock file and package.json to the container
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

ENV MONGO_URI=$MONGO_URI
ENV DB_NAME=$DB_NAME
ENV ALLOWED_ORIGINS=$ALLOWED_ORIGINS
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING
ENV PORT=8000
RUN echo "MONGO_URI at build-time: $MONGO_URI"

# Build the application
RUN pnpm run build

# Debug: Check if dist/ exists
RUN ls -la /app/dist

# Stage 2: Create the production image
FROM node:20.11.1-alpine AS final

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /app

# Copy only necessary files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --only=production

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

RUN ls -la /app/dist

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "dist/main"]
