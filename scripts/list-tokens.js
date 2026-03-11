const hre = require("hardhat");

async function main() {
    const cardAddress = "0x4826533B4897376654Bb4d4AD88B7faFD0C98528";
    const CardNFT = await hre.ethers.getContractFactory("CardNFT");
    const cardNFT = CardNFT.attach(cardAddress);

    const total = await cardNFT.totalMinted();
    console.log("Total Minted:", total.toString());

    for (let i = 1; i <= Number(total); i++) {
        try {
            const attrs = await cardNFT.getCardAttributes(i);
            console.log(`Token ${i}: ${attrs[2]} - ${attrs[0]} (Gen ${attrs[6]})`);
        } catch (e) {
            // burned
        }
    }
}

main().catch(console.error);
