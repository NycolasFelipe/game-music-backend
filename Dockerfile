# ==============================================================================
# Stage 1 — Build
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (leveraging Docker layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2 — Production runtime
# ==============================================================================
FROM node:22-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
