FROM node:18-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

COPY package*.json ./

RUN npm install

COPY . .

# Make sure uploads directory exists
RUN mkdir -p uploads/appeals

EXPOSE 5000

# Use a more robust start command that ensures environment variables are loaded
CMD ["npm", "start"]
