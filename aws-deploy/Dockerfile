FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY index.js ./
COPY public ./public
COPY shared ./shared
COPY drizzle.config.ts ./

# Expose port
EXPOSE 8081

# Set environment
ENV NODE_ENV=production
ENV PORT=8081

# Start application
CMD ["npm", "start"]