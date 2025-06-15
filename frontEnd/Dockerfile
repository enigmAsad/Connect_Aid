FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Expose the port that serve will use
EXPOSE 5173

# Command to serve the production build
CMD ["serve", "-s", "dist", "-l", "5173"]
