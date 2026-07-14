# ==========================================
# STAGE 1: Build Phase
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for compiling native packages (if any)
RUN apk add --no-cache libc6-compat

# Copy dependency specifications and lock files
COPY package.json package-lock.json* ./

# Install packages with strict production integrity audits
RUN npm ci --include=dev

# Copy source tree and configuration files
COPY . .

# Build Vite application for production (produces highly optimized dist/ bundle)
RUN npm run build

# ==========================================
# STAGE 2: Hardened Nginx Runner Phase
# ==========================================
FROM nginx:1.25-alpine

# Copy built bundle from Builder Stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration with secure hardened profile
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard egress ingress ports
EXPOSE 3000

# Start hardened web daemon
CMD ["nginx", "-g", "daemon off;"]
