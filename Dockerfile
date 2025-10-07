# Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy app sources
COPY . .

# Expose port used by the app
EXPOSE 3000

# Use a non-root user optionally (commented)
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

CMD ["node", "server.js"]