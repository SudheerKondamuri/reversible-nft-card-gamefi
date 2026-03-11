#!/bin/sh
set -e

echo "Reading contract addresses from /shared/addresses.json..."
node -e "
const fs = require('fs');
const addr = JSON.parse(fs.readFileSync('/shared/addresses.json', 'utf8'));
const lines = [
  'NEXT_PUBLIC_CARD_NFT_ADDRESS='            + addr.CARD_NFT_ADDRESS,
  'NEXT_PUBLIC_COMBINATION_MANAGER_ADDRESS=' + addr.COMBINATION_MANAGER_ADDRESS,
  'NEXT_PUBLIC_CHAIN_ID=31337',
  'NEXT_PUBLIC_RPC_URL=http://localhost:8545',
].join('\n') + '\n';
fs.writeFileSync('/app/.env.local', lines);
console.log('Written .env.local');
console.log('  CardNFT:            ', addr.CARD_NFT_ADDRESS);
console.log('  CombinationManager: ', addr.COMBINATION_MANAGER_ADDRESS);
"

echo "Starting Next.js frontend..."
exec npm run dev -- --hostname 0.0.0.0
