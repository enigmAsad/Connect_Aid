FROM node:18-alpine

WORKDIR /app

# Install system dependencies in a single layer (following backend pattern)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    wget \
    curl \
    bash

# Set Chrome environment variables for Selenium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Copy package files first (following backend/frontend pattern)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test files
COPY . .

# Make run-tests.sh executable
RUN chmod +x run-tests.sh

# Create directory for test results and screenshots
RUN mkdir -p test-results screenshots

# Health check to ensure Chrome is working
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD chromium-browser --version || exit 1

# Default command (using bash to execute the shell script)
CMD ["bash", "./run-tests.sh"] 