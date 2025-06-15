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

# Set test environment variables
ENV TEST_BASE_URL=http://frontend:80
ENV CI=true

# Get exact Chrome version and install matching ChromeDriver
RUN CHROME_VERSION=$(chromium-browser --version | awk '{print $2}') && \
    echo "Chrome version: $CHROME_VERSION" && \
    CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d'.' -f1) && \
    echo "Chrome major version: $CHROME_MAJOR_VERSION" && \
    CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR_VERSION") && \
    echo "ChromeDriver version: $CHROMEDRIVER_VERSION" && \
    wget -q "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" && \
    unzip chromedriver_linux64.zip && \
    mv chromedriver /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm chromedriver_linux64.zip && \
    # Verify versions match
    echo "Verifying ChromeDriver version..." && \
    chromedriver --version && \
    echo "Verifying Chrome version..." && \
    chromium-browser --version

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