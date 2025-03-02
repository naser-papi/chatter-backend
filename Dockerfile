# Stage 1: Build the application
FROM node:20.11.1-alpine AS builder

ARG MONGO_URI
ARG DB_NAME
ARG ALLOWED_ORIGINS
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG AZURE_STORAGE_CONNECTION_STRING

RUN corepack enable && corepack prepare pnpm@latest --activate

# Change to Azure's expected directory
WORKDIR /home/site/wwwroot

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

RUN ls -la /home/site/wwwroot  # Debug: Check the built files

# Stage 2: Create the production image
FROM node:20.11.1-alpine AS final

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /home/site/wwwroot

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --only=production

COPY --from=builder /home/site/wwwroot/dist ./dist

RUN ls -la /home/site/wwwroot/dist  # Debug: Check copied files

EXPOSE 8000
CMD ["pnpm", "start:prod"]
