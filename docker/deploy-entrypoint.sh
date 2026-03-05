#!/bin/sh
set -e

# By the time this container starts, the hardhat service is already confirmed
# healthy (TCP port 8545 open) thanks to depends_on condition: service_healthy.

echo "Deploying contracts via Hardhat Ignition (network: localhost)..."
npx hardhat ignition deploy ignition/modules/GameFi.ts --network localhost --yes

echo "Writing contract addresses to shared volume..."
node scripts/write-addresses.js

echo "Deployment complete."
