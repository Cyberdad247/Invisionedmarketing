FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Build for production
RUN npm run build

# Command to run the application
CMD ["npm", "start"]
