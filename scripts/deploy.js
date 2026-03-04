const hre = require("hardhat");

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

  // Seed Generation 0 Cards
  console.log("Seeding initial Gen 0 cards for the dev address...");
  const devAddress = deployer.address;

  // Fire Set
  await cardNFT.mintCardWithGen(devAddress, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0);
  await cardNFT.mintCardWithGen(devAddress, "Ember Spirit", 1, "Fire", 4, 3, "Burn", 0);
  await cardNFT.mintCardWithGen(devAddress, "Blazing Knight", 2, "Fire", 7, 6, "Shield Breaker", 0);

  // Water Set
  await cardNFT.mintCardWithGen(devAddress, "Water Droplet", 1, "Water", 2, 4, "Defensive", 0);
  await cardNFT.mintCardWithGen(devAddress, "Tide Caller", 1, "Water", 3, 5, "Wave", 0);
  await cardNFT.mintCardWithGen(devAddress, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0);

  // Earth Set
  await cardNFT.mintCardWithGen(devAddress, "Stone Pebble", 1, "Earth", 2, 5, "Sturdy", 0);
  await cardNFT.mintCardWithGen(devAddress, "Root Tender", 1, "Earth", 3, 4, "Growth", 0);

  // Air Set
  await cardNFT.mintCardWithGen(devAddress, "Breeze Wisp", 1, "Air", 4, 2, "Evasive", 0);

  // Lightning Set
  await cardNFT.mintCardWithGen(devAddress, "Thunder Strike", 2, "Lightning", 10, 4, "Shock", 0);

  console.log("Deployment and seeding completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
