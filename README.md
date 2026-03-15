# Advanced NFT Card Combination System

> 🎬 **Project Walkthrough**: [Watch on YouTube](https://www.youtube.com/watch?v=gBhSP5s6CPU)

Welcome to the **Reversible NFT Card GameFi** repository. This project pioneers a dual-layer smart contract GameFi architecture incorporating two separate mechanisms for NFT card combinations: traditional deflationary **burn-and-mint** and a novel, reversible **fusion** mechanism.

## Features Built
- **`CardNFT.sol`**: An advanced ERC721 tracking intrinsic `Card` metadata, rarity tiers, elements, generation counts, and real-time total supply mappings directly on-chain.
- **`CombinationManager.sol`**: A stateless engine powering combinations using deterministic randomness (`RarityLogic`), Attribute calculations including Generation penalties (`AttributeCalculator`), and complex element combination matrices (`ElementMatrix`).
- **Progressive Fuel**: A built-in anti-hoarding economic system requiring "Common" rarity cards to be burned to fuel higher-tier combinations.
- **Reversible Fusions**: Players can lock/stake their component NFTs securely in the manager contract in return for a new "Fused" card. They can un-fuse at any point to retrieve the original items.
- **Cooldown Limits**: A 100-block localized mapping mitigates botting, chaining, and rapid combination exploitation. 

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or strictly compatible LTS versions)
- [Hardhat](https://hardhat.org/) installed globally or managed locally
- Docker Desktop

### Installation
1. Clone the repository natively.
2. Install all dependencies:
```bash
npm install
```
3. Compile the Solidity contracts (uses EVM Cancun rules + viaIR optimization):
```bash
npx hardhat compile
```

## Running Tests
An extensive test suite (`test/`) guarantees structural and logic compliance across 20 distinct boundary edge cases.
```bash
npx hardhat test
```
*(To benchmark gas, prefix the command with `REPORT_GAS=true`)*

## Local Deployment & Docker
A `scripts/deploy.js` file is provided which automatically spins up the `CardNFT` and `CombinationManager` contracts and natively assigns the manager Role before minting and seeding an initial Generation 0 batch.

To run a persistent local development node identically matching Hardhat's environment using Docker Compose:
```bash
docker-compose up -d --build
```

You can then execute subsequent deployments dynamically:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Documentation
- `DESIGN.md`: Explains the macroeconomics of Burn-and-Mint versus Reversible Fusion.
- `SECURITY.md`: Analyzes threat-vectors, reentrancy guards, and scaling architectures using VRF modules.
- `GAS_REPORT.md`: Output of the native `hardhat-gas-reporter` plugin evaluating local EVM costs.
