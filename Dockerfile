# Use a Node.js base image
FROM node:20.12.0

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /usr/src/app

# Copy package manager lock file and package.json to the container
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 8000

# Default environment variables (optional to provide defaults)
ENV NODE_ENV=production
ENV PORT=8000

# Start the application
CMD ["pnpm", "run", "start:prod"]