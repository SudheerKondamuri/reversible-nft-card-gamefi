FROM node:20-alpine

WORKDIR /app

# Install netcat for healthcheck
RUN apk add --no-cache netcat-openbsd

# Copy package files and install dependencies first (layer cache)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all project source
COPY contracts/        ./contracts/
COPY ignition/         ./ignition/
COPY scripts/          ./scripts/
COPY test/             ./test/
COPY hardhat.config.ts ./
COPY tsconfig.json     ./
COPY .env              ./.env

# Pre-compile contracts so deploy is faster
RUN npx hardhat compile

# Make entrypoints executable
COPY docker/entrypoint.sh        /usr/local/bin/entrypoint.sh
COPY docker/deploy-entrypoint.sh /usr/local/bin/deploy-entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/deploy-entrypoint.sh

EXPOSE 8545

CMD ["/usr/local/bin/entrypoint.sh"]
