#!/bin/sh
set -e

echo "Starting Hardhat node on 0.0.0.0:8545..."
exec npx hardhat node --hostname 0.0.0.0
