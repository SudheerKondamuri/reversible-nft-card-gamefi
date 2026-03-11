#!/bin/sh
set -e

echo "Deploying contracts to $HARDHAT_RPC_URL..."
npx hardhat run scripts/deploy.js --network localhost

echo "Deploy complete. Addresses written to /shared/addresses.json."
