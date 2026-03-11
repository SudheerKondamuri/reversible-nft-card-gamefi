const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CardNFT
  const CardNFT = await hre.ethers.getContractFactory("CardNFT");
  const cardNFT = await CardNFT.deploy();
  await cardNFT.waitForDeployment();
  const cardNFTAddress = await cardNFT.getAddress();
  console.log("CardNFT deployed to:", cardNFTAddress);

  // Deploy CombinationManager
  const CombinationManager = await hre.ethers.getContractFactory("CombinationManager");
  const combinationManager = await CombinationManager.deploy(cardNFTAddress);
  await combinationManager.waitForDeployment();
  console.log("CombinationManager deployed to:", await combinationManager.getAddress());

  // Authorize CombinationManager in CardNFT
  await cardNFT.setManager(await combinationManager.getAddress(), true);
  console.log("CombinationManager authorized to mint/burn.");

  // Set the base image URI for the CardNFT metadata
  const baseImageURI = process.env.BASE_IMAGE_URI || "ipfs://PLACEHOLDER_CID/cards/";
  await cardNFT.setBaseImageURI(baseImageURI);
  console.log("Base image URI set to:", baseImageURI);

  // Seed Generation 0 Cards — all base cards minted 3x
  console.log("Seeding initial Gen 0 cards for the dev address...");
  const devAddress = deployer.address;

  // Helper: mint a card 3 times
  const mint2 = async (name, rarity, element, atk, def, ability) => {
    for (let i = 0; i < 2; i++) {
      await cardNFT.mintCardWithGen(devAddress, name, rarity, element, atk, def, ability, 0);
    }
    console.log(`  ✓ ${name} x2`);
  };
    const mint1 = async (name, rarity, element, atk, def, ability) => {
    for (let i = 0; i < 1; i++) {
      await cardNFT.mintCardWithGen(devAddress, name, rarity, element, atk, def, ability, 0);
    }
    console.log(`  ✓ ${name} x1`);
  };

  // ── Fire ──────────────────────────────────────────────────────────────────
  await mint2("Flame Spark",       1, "Fire",      3,  2, "Ignite");
  await mint1("Ember Spirit",      1, "Fire",      4,  3, "Burn");
  await mint1("Blazing Knight",    2, "Fire",      7,  6, "Shield Breaker");
  await mint1("Inferno Champion",  3, "Fire",     12,  8, "Inferno Burst");

  // ── Water ─────────────────────────────────────────────────────────────────
  await mint2("Water Droplet",     1, "Water",     2,  4, "Defensive");
  await mint1("Tide Caller",       1, "Water",     3,  5, "Wave");
  await mint1("Ocean Guardian",    2, "Water",     6,  9, "Barrier");
  await mint1("Deep Sea Monarch",  3, "Water",    10, 13, "Tidal Surge");

  // ── Earth ─────────────────────────────────────────────────────────────────
  await mint2("Stone Pebble",      1, "Earth",     2,  5, "Sturdy");
  await mint1("Root Tender",       1, "Earth",     3,  4, "Growth");
  await mint1("Stone Fortress",    2, "Earth",     4, 12, "Fortify");
  await mint1("Nature Warden",     2, "Earth",     5,  8, "Regrowth");

  // ── Air ───────────────────────────────────────────────────────────────────
  await mint2("Breeze Wisp",       1, "Air",       4,  2, "Evasive");
  await mint1("Dust Phantom",      1, "Air",       4,  3, "Phase Shift");
  await mint1("Sky Sovereign",     3, "Air",       9,  6, "Gale Force");

  // ── Lightning ─────────────────────────────────────────────────────────────
  await mint2("Thunder Striker",   1, "Lightning",  6,  3, "Bolt");
  await mint1("Thunder Strike",    2, "Lightning", 10,  4, "Shock");
  await mint1("Thunder Lord",      3, "Lightning", 13,  5, "Chain Lightning");
  await mint1("Zeus Reborn",       4, "Lightning", 15,  8, "Divine Thunder");

  console.log("\nDeployment and seeding completed successfully.");

  // Write addresses — to /shared (Docker) or frontend/.env.local (local dev)
  const combinationManagerAddress = await combinationManager.getAddress();

  if (fs.existsSync('/shared')) {
    // Docker: write to shared volume so frontend container can read it
    const out = JSON.stringify({ CARD_NFT_ADDRESS: cardNFTAddress, COMBINATION_MANAGER_ADDRESS: combinationManagerAddress }, null, 2);
    fs.writeFileSync('/shared/addresses.json', out);
    console.log("\n✅ Addresses written to /shared/addresses.json");
  } else {
    // Local dev: write directly to frontend/.env.local
    const envLocal = path.join(__dirname, "../frontend/.env.local");
    const envContent = `NEXT_PUBLIC_CARD_NFT_ADDRESS=${cardNFTAddress}\nNEXT_PUBLIC_COMBINATION_MANAGER_ADDRESS=${combinationManagerAddress}\n`;
    fs.writeFileSync(envLocal, envContent);
    console.log("\n✅ Addresses written to frontend/.env.local");
  }
  console.log("   CardNFT:            ", cardNFTAddress);
  console.log("   CombinationManager: ", combinationManagerAddress);
  console.log("\n⚠️  Restart the frontend dev server to pick up the new addresses.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
