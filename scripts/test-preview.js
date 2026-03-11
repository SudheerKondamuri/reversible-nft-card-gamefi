const hre = require("hardhat");

async function main() {
    const combinationManagerAddress = "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf"; // latest from deployment
    const CombinationManager = await hre.ethers.getContractFactory("CombinationManager");
    const combinationManager = CombinationManager.attach(combinationManagerAddress);

    // We know deployer has Token #9 (Thunder Strike, Lightning) and some Flame Sparks (Token #1, #2, #3, Fire)
    console.log("Reading combination preview for Token 9 (Lightning) + Token 1 (Fire)...");

    try {
        const preview = await combinationManager.getCombinationPreview(9, 2);
        console.log("Preview Result:", preview);
    } catch (err) {
        console.error("Error reading preview:", err);
    }
}

main().catch(console.error);
