# Use Node.js 18-alpine as the base image
FROM node:18-alpine AS base

# Install dependencies needed for Node.js to work properly
FROM base AS deps

# Install build dependencies for sharp and other packages
RUN apk add --no-cache libc6-compat make g++ cairo-dev libjpeg-turbo-dev pango-dev giflib-dev

WORKDIR /app

# Copy over package files and install dependencies
COPY package*.json ./
RUN npm ci

# Build the Next.js app
FROM base AS builder
WORKDIR /app

# Pass Redis environment variables to the build process using ARG
ARG REDIS_URL
ARG REDIS_TOKEN

# Set Redis variables as environment variables during the build
ENV REDIS_URL=${REDIS_URL}
ENV REDIS_TOKEN=${REDIS_TOKEN}

# Copy the dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire application to the image
COPY . .

# Disabling Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN echo "REDIS_URL=${REDIS_URL}, REDIS_TOKEN=${REDIS_TOKEN}" # Debugging to ensure values are passed
RUN npm run build

# Prepare the final image to run the Next.js app
FROM base AS runner
WORKDIR /app

# Setting environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV REDIS_URL=https://working-fly-20120.upstash.io
ENV REDIS_TOKEN=AU6YAAIjcDFmNTVhOWIwNTQzNzI0ZjFmYmJhNTQwOTg3YWQxMjliOHAxMA

# Create nodejs group and nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy required files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change the user to `nextjs`
USER nextjs

# Expose the application port
EXPOSE 3002
ENV PORT 3002

# Start the application using the standalone mode
CMD ["node", ".next/standalone/server.js"]
