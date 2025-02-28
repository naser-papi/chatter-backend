# Stage 1: Build the application
FROM node:20.11.1-alpine AS Builder

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

# Stage 2: Create the production image
FROM node:20.11.1-alpine AS ImageBuilder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

ARG MONGO_URI
ARG PORT
ARG DB_NAME
ARG ALLOWED_ORIGINS
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG AZURE_STORAGE_CONNECTION_STRING

# Set the working directory
WORKDIR /app

# Copy package manager lock file and package.json to the container
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile


# Copy the build output from the first stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 8000

# Default environment variables (optional to provide defaults)
ENV NODE_ENV=production
ENV MONGO_URI=$MONGO_URI
ENV DB_NAME=$DB_NAME
ENV ALLOWED_ORIGINS=$ALLOWED_ORIGINS
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING
ENV PORT=8000
RUN echo "MONGO_URI at build-time: $MONGO_URI"


# Start the application
CMD ["pnpm", "start:prod"]