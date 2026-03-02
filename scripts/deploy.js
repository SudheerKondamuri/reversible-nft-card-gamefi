const hre = require("hardhat");

async function main() {
  console.log("Deploying Reversible NFT Card GameFi contracts...");

  // TODO: Implement deployment logic

  try {
    // Deploy CardNFT contract
    console.log("Deploying CardNFT...");
    const CardNFT = await hre.ethers.getContractFactory("CardNFT");
    const cardNFT = await CardNFT.deploy();
    await cardNFT.deployed();
    console.log("CardNFT deployed to:", cardNFT.address);

    // Deploy CombinationManager contract
    console.log("Deploying CombinationManager...");
    const CombinationManager = await hre.ethers.getContractFactory("CombinationManager");
    const combinationManager = await CombinationManager.deploy(cardNFT.address);
    await combinationManager.deployed();
    console.log("CombinationManager deployed to:", combinationManager.address);

    // TODO: Save deployment addresses
    // TODO: Verify contracts on etherscan

    console.log("Deployment complete!");
    console.log("Contracts deployed:");
    console.log("- CardNFT:", cardNFT.address);
    console.log("- CombinationManager:", combinationManager.address);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();
