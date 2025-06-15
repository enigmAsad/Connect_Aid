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
    ttf-freefont \
    wget \
    unzip \
    curl

# Set Chrome environment variables
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Install ChromeDriver in the correct location
RUN mkdir -p /root/.cache/selenium/chromedriver/linux64/136.0.7103.113 && \
    wget -q "https://storage.googleapis.com/chrome-for-testing-public/136.0.7103.113/linux64/chromedriver-linux64.zip" && \
    unzip chromedriver-linux64.zip && \
    mv chromedriver-linux64/chromedriver /root/.cache/selenium/chromedriver/linux64/136.0.7103.113/chromedriver && \
    chmod +x /root/.cache/selenium/chromedriver/linux64/136.0.7103.113/chromedriver && \
    rm -rf chromedriver-linux64.zip chromedriver-linux64

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test files
COPY . .

# Create directory for test results
RUN mkdir -p test-results

# Set default command
CMD ["npm", "test"] 