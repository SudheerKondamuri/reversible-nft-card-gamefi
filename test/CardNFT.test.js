const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardNFT Contract", function () {
  let cardNFT;
  let owner, addr1, addr2;

  beforeEach(async function () {
    // TODO: Deploy contract
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy CardNFT
    const CardNFT = await ethers.getContractFactory("CardNFT");
    cardNFT = await CardNFT.deploy();
  });

  describe("Minting", function () {
    it("Should mint a card with correct attributes", async function () {
      // TODO: Implement test
      const tx = await cardNFT.mint(addr1.address, 0, 1);
      expect(tx).to.emit(cardNFT, "CardMinted");
    });

    it("Should only allow owner to mint", async function () {
      // TODO: Implement test
      await expect(
        cardNFT.connect(addr1).mint(addr1.address, 0, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should increment card counter on mint", async function () {
      // TODO: Implement test
    });
  });

  describe("Card Attributes", function () {
    it("Should return correct power and defense values", async function () {
      // TODO: Implement test
    });

    it("Should apply rarity bonuses correctly", async function () {
      // TODO: Implement test
    });
  });

  describe("Transfers", function () {
    it("Should allow card transfer between addresses", async function () {
      // TODO: Implement test
    });

    it("Should update ownership correctly", async function () {
      // TODO: Implement test
    });
  });
});
