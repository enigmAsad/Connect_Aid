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
    unzip

# Set environment variables for Chrome
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Install ChromeDriver
RUN CHROME_VERSION=$(chromium-browser --version | awk '{print $2}' | cut -d'.' -f1) && \
    CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_VERSION) && \
    wget -q "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" && \
    unzip chromedriver_linux64.zip && \
    mv chromedriver /usr/bin/chromedriver && \
    chmod +x /usr/bin/chromedriver && \
    rm chromedriver_linux64.zip

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