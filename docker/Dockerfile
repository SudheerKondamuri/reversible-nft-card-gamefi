FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies first (layer cache)
COPY package*.json ./
RUN npm install

# Copy all project source
COPY contracts/   ./contracts/
COPY ignition/    ./ignition/
COPY scripts/     ./scripts/
COPY test/        ./test/
COPY hardhat.config.ts ./
COPY tsconfig.json ./

# Make entrypoints executable
COPY docker/entrypoint.sh        /usr/local/bin/entrypoint.sh
COPY docker/deploy-entrypoint.sh /usr/local/bin/deploy-entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/deploy-entrypoint.sh

EXPOSE 8545

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
