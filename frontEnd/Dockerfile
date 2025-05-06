FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port that Vite uses
EXPOSE 5173

# Command to run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
