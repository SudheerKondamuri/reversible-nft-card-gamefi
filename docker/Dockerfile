FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy contract files
COPY contracts/ ./contracts/
COPY scripts/ ./scripts/
COPY test/ ./test/
COPY hardhat.config.js ./
COPY tsconfig.json ./

# Expose port for hardhat node
EXPOSE 8545

# Default command
CMD ["npx", "hardhat", "node"]
