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

# Install ChromeDriver
RUN CHROMEDRIVER_VERSION="114.0.5735.90" && \
    echo "Installing ChromeDriver version: $CHROMEDRIVER_VERSION" && \
    wget -q "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" && \
    unzip chromedriver_linux64.zip && \
    mv chromedriver /usr/bin/chromedriver && \
    chmod +x /usr/bin/chromedriver && \
    rm chromedriver_linux64.zip && \
    # Verify installation
    echo "Verifying ChromeDriver version..." && \
    /usr/bin/chromedriver --version && \
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