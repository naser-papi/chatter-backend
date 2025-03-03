# Stage 1: Build the application
FROM node:20.11.1-alpine AS builder

ENV NODE_ENV=development

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

# Make sure the dev dependencies (including Nest CLI) get installed for the build
RUN pnpm install --frozen-lockfile

COPY . .

RUN node node_modules/@nestjs/cli/bin/nest.js build



# Stage 2: Create the production image
FROM node:20.11.1-alpine AS final

ENV NODE_ENV=production

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create /app folder, set permissions
RUN addgroup -g 1001 appgroup \
    && adduser -D -G appgroup -u 1001 appuser \
    && mkdir -p /app \
    && chown -R appuser:appgroup /app

WORKDIR /app

# Switch to non-root user only after you have the directory owned by them
USER appuser

# Copy pnpm files, install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --only=production

# Copy the compiled code from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 8000
CMD ["pnpm", "start:prod"]
