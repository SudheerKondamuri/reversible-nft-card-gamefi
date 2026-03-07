const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameFi Advanced Mechanics & Security Suite", function () {
    let cardNFT, combinationManager;
    let owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const CardNFT = await ethers.getContractFactory("CardNFT");
        cardNFT = await CardNFT.deploy();

        const CombinationManager = await ethers.getContractFactory("CombinationManager");
        combinationManager = await CombinationManager.deploy(await cardNFT.getAddress());

        await cardNFT.setManager(await combinationManager.getAddress(), true);

        // Seed initial setup
        await cardNFT.mintCardWithGen(user1.address, "Fire Sprite", 1, "Fire", 5, 5, "Burn", 0); // ID 1
        await cardNFT.mintCardWithGen(user1.address, "Water Sprite", 1, "Water", 5, 5, "Splash", 0); // ID 2
        await cardNFT.mintCardWithGen(user1.address, "Fire Elemental", 2, "Fire", 10, 10, "Blaze", 0); // ID 3
        await cardNFT.mintCardWithGen(user1.address, "Water Elemental", 2, "Water", 10, 10, "Tsunami", 0); // ID 4
        await cardNFT.mintCardWithGen(user1.address, "Fuel1", 1, "Earth", 5, 5, "None", 0); // ID 5
        await cardNFT.mintCardWithGen(user1.address, "MaxGen", 1, "Air", 5, 5, "Fly", 5); // ID 6
    });

    describe("Core Combinations & Fusions", function () {
        it("Should reject same card combination", async function () {
            await expect(combinationManager.isValidCombination(1, 1)).to.eventually.be.false;
        });

        it("Should reject unowned cards", async function () {
            await expect(combinationManager.connect(user2).combineCards(1, 2, [])).to.be.revertedWith("Not owner");
        });

        it("Should burn inputs and mint composite", async function () {
            await combinationManager.connect(user1).combineCards(1, 2, []);
            await expect(cardNFT.ownerOf(1)).to.be.reverted;
            expect(await cardNFT.ownerOf(7)).to.equal(user1.address); // New ID 7
        });

        it("Should fuse cards and lock originals", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            expect(await cardNFT.isLocked(1)).to.be.true;
            expect(await cardNFT.ownerOf(7)).to.equal(user1.address);
        });

        it("Should unfuse successfully and return base state", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            await ethers.provider.send("hardhat_mine", ["0x100"]);
            await combinationManager.connect(user1).unfuseCard(7);
            expect(await cardNFT.isLocked(1)).to.be.false;
            await expect(cardNFT.ownerOf(7)).to.be.reverted;
        });
    });

    describe("Economic Balance & Anti-Hoarding", function () {
        it("Should require Progressive Fuel for higher tier combinations", async function () {
            await expect(combinationManager.connect(user1).combineCards(3, 4, [])).to.be.revertedWith("Insufficient fuel provided");
            await combinationManager.connect(user1).combineCards(3, 4, [5]); // Pass 1 common fuel for Rare+Rare
            await expect(cardNFT.ownerOf(5)).to.be.reverted;
        });

        it("Should reject non-common cards as fuel", async function () {
            await expect(combinationManager.connect(user1).combineCards(3, 4, [3])).to.be.revertedWith("Fuel must be Common");
        });

        it("Should accurately track player combination counts globally", async function () {
            await combinationManager.connect(user1).combineCards(1, 2, []);
            expect(await combinationManager.getPlayerCombinationCount(user1.address)).to.equal(1);
        });

        it("Should decay stats by 1 point per 1000 blocks (Anti-Hoarding #2)", async function () {
            await ethers.provider.send("hardhat_mine", ["0x3E8"]); // 1000 in hex
            const attrs = await cardNFT.getCardAttributes(1);
            expect(attrs[3]).to.equal(4); // Original 5 - 1 decay
        });

        it("Should not decay stats below minimum threshold of 1", async function () {
            await ethers.provider.send("hardhat_mine", ["0x1770"]); // 6000 blocks
            const attrs = await cardNFT.getCardAttributes(1);
            expect(attrs[3]).to.equal(1); // Floor hit
        });
        
        it("Should allow owner to mint Seasonal Promo cards (Anti-Deflation)", async function () {
            await cardNFT.mintSeasonalPromo(user1.address, "Winter Yeti", 3, "Water", 15, 15, "Freeze");
            expect(await cardNFT.ownerOf(7)).to.equal(user1.address);
        });
    });

    describe("Security & Edge Cases", function () {
        it("Should prevent transferring a locked (escrowed) card", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            await expect(
                cardNFT.connect(user1).transferFrom(user1.address, user2.address, 1)
            ).to.be.revertedWith("Card is locked in escrow");
        });

        it("Should reject combinations involving max generation cards", async function () {
            await expect(combinationManager.isValidCombination(1, 6)).to.eventually.be.false;
        });

        it("Should not unfuse an unfused card a second time", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            await ethers.provider.send("hardhat_mine", ["0x100"]);
            await combinationManager.connect(user1).unfuseCard(7);
            await expect(combinationManager.connect(user1).unfuseCard(7)).to.be.revertedWithCustomError(cardNFT, "ERC721NonexistentToken");
        });

        it("Should revert if non-owner tries to unfuse", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            await expect(combinationManager.connect(user2).unfuseCard(7)).to.be.revertedWith("Not owner");
        });

        it("Should block double-fusing an already locked card", async function () {
            await combinationManager.connect(user1).fuseCards(1, 2);
            await ethers.provider.send("hardhat_mine", ["0x100"]);
            await expect(combinationManager.connect(user1).fuseCards(1, 3)).to.be.revertedWith("Invalid combination");
        });

        it("Should accurately match preview attributes with actual combination result", async function () {
            const preview = await combinationManager.getCombinationPreview(1, 2);
            const tx = await combinationManager.connect(user1).combineCards(1, 2, []);
            const receipt = await tx.wait();
            
            const event = receipt.logs.find(l => l.fragment && l.fragment.name === 'CardsCombined');
            const actual = await cardNFT.getCardAttributes(event.args[0]);
            
            expect(actual[2]).to.equal(preview.element);
            expect(actual[3]).to.equal(preview.attack);
            expect(actual[4]).to.equal(preview.defense);
        });
    });
});