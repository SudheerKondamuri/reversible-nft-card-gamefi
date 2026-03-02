#!/bin/bash
set -e

echo "Starting Reversible NFT Card GameFi environment..."

# Wait for services to be ready
sleep 5

# Run database migrations if needed
# TODO: Add migration commands

# Deploy contracts
echo "Deploying smart contracts..."
npx hardhat run scripts/deploy.js --network hardhat

# Seed initial data
echo "Seeding initial card data..."
npx hardhat run scripts/seedCards.js --network hardhat

# Start Hardhat node
echo "Starting Hardhat node..."
npx hardhat node
