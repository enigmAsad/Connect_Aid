FROM node:18-alpine

WORKDIR /app

# Install dependencies for build
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist

# Install serve to run the production build
RUN npm install -g serve

# Expose the port that serve will use
EXPOSE 5173

# Command to serve the production build
CMD ["serve", "-s", "dist", "-l", "5173"]
