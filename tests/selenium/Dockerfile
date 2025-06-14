FROM node:18-alpine

WORKDIR /app

# Install dependencies for running tests
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Chrome
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test files
COPY tests/selenium ./tests/selenium

# Create directory for test results
RUN mkdir -p test-results

# Set the default command to run tests
CMD ["npm", "test"] 