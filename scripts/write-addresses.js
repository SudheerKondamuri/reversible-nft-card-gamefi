/**
 * Reads Hardhat Ignition's deployed_addresses.json for chain 31337
 * and writes the contract addresses to /shared/addresses.json so the
 * frontend container can pick them up at startup.
 */
const fs = require('fs');
const path = require('path');

const deploymentsFile = path.join(
  __dirname,
  '../ignition/deployments/chain-31337/deployed_addresses.json'
);
const outputFile = '/shared/addresses.json';

if (!fs.existsSync(deploymentsFile)) {
  console.error('ERROR: Deployments file not found at', deploymentsFile);
  process.exit(1);
}

const addresses = JSON.parse(fs.readFileSync(deploymentsFile, 'utf8'));
console.log('Raw Ignition addresses:', JSON.stringify(addresses, null, 2));

const cardNFTAddress = addresses['CardNFTModule#CardNFT'];
const combinationManagerAddress = addresses['CombinationManagerModule#CombinationManager'];

if (!cardNFTAddress) {
  console.error('ERROR: CardNFTModule#CardNFT not found. Keys present:', Object.keys(addresses));
  process.exit(1);
}
if (!combinationManagerAddress) {
  console.error('ERROR: CombinationManagerModule#CombinationManager not found. Keys present:', Object.keys(addresses));
  process.exit(1);
}

const output = {
  CARD_NFT_ADDRESS: cardNFTAddress,
  COMBINATION_MANAGER_ADDRESS: combinationManagerAddress,
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log('Contract addresses written to', outputFile);
console.log('  CardNFT:            ', cardNFTAddress);
console.log('  CombinationManager: ', combinationManagerAddress);
