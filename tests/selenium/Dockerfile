FROM node:18-alpine

WORKDIR /app

# Install Chrome and dependencies
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

# Install ChromeDriver
RUN CHROME_VERSION=$(chromium-browser --version | awk '{print $2}' | cut -d'.' -f1) && \
    echo "Detected Chrome version: $CHROME_VERSION" && \
    CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_VERSION) && \
    echo "Installing ChromeDriver version: $CHROMEDRIVER_VERSION" && \
    wget -q "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" && \
    unzip chromedriver_linux64.zip && \
    mkdir -p /usr/local/bin && \
    mv chromedriver /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm chromedriver_linux64.zip && \
    echo "Verifying ChromeDriver version..." && \
    chromedriver --version && \
    echo "Verifying Chrome version..." && \
    chromium-browser --version && \
    echo "Verifying ChromeDriver path..." && \
    which chromedriver

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test files
COPY . .

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
ENV PATH="/usr/local/bin:${PATH}"

# Run tests
CMD ["npm", "test"] 