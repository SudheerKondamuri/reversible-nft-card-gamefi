const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardNFT Contract", function () {
  let cardNFT;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CardNFT = await ethers.getContractFactory("CardNFT");
    cardNFT = await CardNFT.deploy();
  });

  describe("Minting", function () {
    it("Should mint a card with correct attributes", async function () {
      const tx = await cardNFT.mintCard(addr1.address, "Fire Dragon", 2, "Fire", 10, 8, "Burn");
      const receipt = await tx.wait();

      const event = receipt.logs.find(e => e.fragment && e.fragment.name === "CardMinted");
      expect(event).to.not.be.undefined;

      const tokenId = event.args[0];
      const attributes = await cardNFT.getCardAttributes(tokenId);

      expect(attributes[0]).to.equal("Fire Dragon"); // name
      expect(attributes[1]).to.equal(2); // rarity (Rare)
      expect(attributes[2]).to.equal("Fire"); // element
      expect(attributes[3]).to.equal(10); // attack
      expect(attributes[4]).to.equal(8); // defense
      expect(attributes[5]).to.equal("Burn"); // ability
      expect(attributes[6]).to.equal(0); // generation
    });

    it("Should only allow owner or manager to mint", async function () {
      await expect(
        cardNFT.connect(addr1).mintCard(addr1.address, "Fire Dragon", 2, "Fire", 10, 8, "Burn")
      ).to.be.revertedWith("Not authorized");
    });

    it("Should track total minted correctly", async function () {
      await cardNFT.mintCard(addr1.address, "A", 1, "Fire", 1, 1, "None");
      await cardNFT.mintCard(addr1.address, "B", 1, "Fire", 1, 1, "None");
      expect(await cardNFT.totalMinted()).to.equal(2);
    });
  });

  describe("Supply Tracking", function () {
    it("Should track supply by rarity and element", async function () {
      await cardNFT.mintCard(addr1.address, "A", 1, "Fire", 1, 1, "None");
      await cardNFT.mintCard(addr1.address, "B", 1, "Water", 1, 1, "None");
      await cardNFT.mintCard(addr1.address, "C", 2, "Fire", 1, 1, "None");

      expect(await cardNFT.getTotalSupplyByRarity(1)).to.equal(2);
      expect(await cardNFT.getTotalSupplyByRarity(2)).to.equal(1);

      expect(await cardNFT.getTotalSupplyByElement("Fire")).to.equal(2);
      expect(await cardNFT.getTotalSupplyByElement("Water")).to.equal(1);
    });
  });

  describe("Transfers", function () {
    it("Should allow card transfer between addresses", async function () {
      await cardNFT.mintCard(addr1.address, "A", 1, "Fire", 1, 1, "N");
      await cardNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
      expect(await cardNFT.ownerOf(1)).to.equal(addr2.address);
    });
  });
});
