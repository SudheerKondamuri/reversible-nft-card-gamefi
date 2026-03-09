// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ICardNFT.sol";
import "./libraries/ElementMatrix.sol";
import "./libraries/RarityLogic.sol";
import "./libraries/AttributeCalculator.sol";

contract CombinationManager is Ownable, ReentrancyGuard {
    ICardNFT public cardNFT;

    uint256 public constant MAX_GENERATION = 5;
    uint256 public constant COOLDOWN_BLOCKS = 100;

    mapping(address => uint256) public lastCombinationBlock;
    mapping(address => uint256) public playerCombinationCount;

    struct FusedData {
        uint256 tokenId1;
        uint256 tokenId2;
        bool isActive;
    }
    mapping(uint256 => FusedData) public fusedCards;

    event CardsCombined(uint256 indexed newTokenId, uint256 indexed tokenId1, uint256 indexed tokenId2, address owner, string resultElement, uint8 resultRarity);
    event CardsFused(uint256 indexed fusedTokenId, uint256 indexed tokenId1, uint256 indexed tokenId2, address owner);
    event CardUnfused(uint256 indexed fusedTokenId, uint256 indexed tokenId1, uint256 indexed tokenId2, address owner);

    constructor(address _cardNFT) Ownable(msg.sender) {
        cardNFT = ICardNFT(_cardNFT);
    }

    modifier applyCooldown() {
        require(lastCombinationBlock[msg.sender] == 0 || block.number >= lastCombinationBlock[msg.sender] + COOLDOWN_BLOCKS, "Cooldown active");
        _;
        lastCombinationBlock[msg.sender] = block.number;
    }

    function _max(uint8 a, uint8 b) internal pure returns (uint8) {
        return a > b ? a : b;
    }

    function getCombinationPreview(uint256 tokenId1, uint256 tokenId2)
        public view returns (string memory element, uint16 attack, uint16 defense, uint8 rarity, string memory ability, uint8 generation, string memory name)
    {
        ( , uint8 rarity1, string memory el1, uint16 atk1, uint16 def1, , uint8 gen1) = cardNFT.getCardAttributes(tokenId1);
        ( , uint8 rarity2, string memory el2, uint16 atk2, uint16 def2, , uint8 gen2) = cardNFT.getCardAttributes(tokenId2);
        
        generation = _max(gen1, gen2) + 1;
        
        ElementMatrix.CombinationResult memory combo = ElementMatrix.getCombination(el1, el2);
        element = combo.newElement;
        name = combo.newName;
        ability = combo.newAbility;
        rarity = RarityLogic.getResultRarity(rarity1, rarity2, 0, msg.sender);
        attack = AttributeCalculator.calculateAttack(atk1, atk2, rarity1, rarity2, combo.attackBonus, generation);
        defense = AttributeCalculator.calculateDefense(def1, def2, rarity1, rarity2, combo.defenseBonus, generation);
    }

    function isValidCombination(uint256 tokenId1, uint256 tokenId2) public view returns (bool) {
        if (tokenId1 == tokenId2) return false;
        if (cardNFT.isLocked(tokenId1) || cardNFT.isLocked(tokenId2)) return false;

        address owner1 = cardNFT.ownerOf(tokenId1);
        address owner2 = cardNFT.ownerOf(tokenId2);
        
        if (owner1 != owner2 || owner1 == address(0)) return false;
        
        ( , , , , , , uint8 gen1) = cardNFT.getCardAttributes(tokenId1);
        ( , , , , , , uint8 gen2) = cardNFT.getCardAttributes(tokenId2);
        if (gen1 >= MAX_GENERATION || gen2 >= MAX_GENERATION) return false;

        return true;
    }

    function combineCards(uint256 tokenId1, uint256 tokenId2, uint256[] calldata fuelCards) 
        external nonReentrant applyCooldown returns (uint256 newTokenId) 
    {
        require(isValidCombination(tokenId1, tokenId2), "Invalid combination");
        require(cardNFT.ownerOf(tokenId1) == msg.sender, "Not owner");

        ( , uint8 r1, , , , , ) = cardNFT.getCardAttributes(tokenId1);
        ( , uint8 r2, , , , , ) = cardNFT.getCardAttributes(tokenId2);
        
        // Anti-hoarding: Progressive Fuel Cost
        uint8 highestRarity = _max(r1, r2);
        if (highestRarity >= RarityLogic.RARE) {
            uint256 requiredFuel = highestRarity - 1;
            require(fuelCards.length >= requiredFuel, "Insufficient fuel provided");
            for (uint i = 0; i < requiredFuel; i++) {
                require(cardNFT.ownerOf(fuelCards[i]) == msg.sender, "Not owner of fuel");
                ( , uint8 fuelRarity, , , , , ) = cardNFT.getCardAttributes(fuelCards[i]);
                require(fuelRarity == RarityLogic.COMMON, "Fuel must be Common");
                require(fuelCards[i] != tokenId1 && fuelCards[i] != tokenId2, "Fuel cannot be main cards");
                cardNFT.burn(fuelCards[i]);
            }
        }

        (string memory newElement, uint16 newAtk, uint16 newDef, , string memory newAbility, uint8 newGen, string memory newName) = getCombinationPreview(tokenId1, tokenId2);
        uint8 newRarity = RarityLogic.getResultRarity(r1, r2, block.timestamp, msg.sender);

        cardNFT.burn(tokenId1);
        cardNFT.burn(tokenId2);
        
        newTokenId = cardNFT.mintCardWithGenAndParents(msg.sender, newName, newRarity, newElement, newAtk, newDef, newAbility, newGen, tokenId1, tokenId2);

        playerCombinationCount[msg.sender]++;
        emit CardsCombined(newTokenId, tokenId1, tokenId2, msg.sender, newElement, newRarity);
    }

    function fuseCards(uint256 tokenId1, uint256 tokenId2) 
        external nonReentrant applyCooldown returns (uint256 fusedTokenId) 
    {
        require(isValidCombination(tokenId1, tokenId2), "Invalid combination");
        require(cardNFT.ownerOf(tokenId1) == msg.sender, "Not owner");

        // Hard lock states inside the NFT Contract
        cardNFT.lockCard(tokenId1);
        cardNFT.lockCard(tokenId2);
        
        (string memory newElement, uint16 newAtk, uint16 newDef, uint8 newRarity, string memory newAbility, uint8 newGen, string memory newName) = getCombinationPreview(tokenId1, tokenId2);
        ( , uint8 r1, , , , , ) = cardNFT.getCardAttributes(tokenId1);
        ( , uint8 r2, , , , , ) = cardNFT.getCardAttributes(tokenId2);
        
        newRarity = RarityLogic.getResultRarity(r1, r2, block.timestamp, msg.sender);
        
        fusedTokenId = cardNFT.mintCardWithGenAndParents(msg.sender, newName, newRarity, newElement, newAtk, newDef, newAbility, newGen, tokenId1, tokenId2);

        fusedCards[fusedTokenId] = FusedData({
            tokenId1: tokenId1,
            tokenId2: tokenId2,
            isActive: true
        });
        
        playerCombinationCount[msg.sender]++;
        emit CardsFused(fusedTokenId, tokenId1, tokenId2, msg.sender);
    }

    function unfuseCard(uint256 fusedTokenId) external nonReentrant {
        require(cardNFT.ownerOf(fusedTokenId) == msg.sender, "Not owner");
        require(fusedCards[fusedTokenId].isActive, "Not a valid fused card");

        FusedData memory data = fusedCards[fusedTokenId];
        
        // Release assets
        cardNFT.unlockCard(data.tokenId1);
        cardNFT.unlockCard(data.tokenId2);

        delete fusedCards[fusedTokenId];
        cardNFT.burn(fusedTokenId);
        
        emit CardUnfused(fusedTokenId, data.tokenId1, data.tokenId2, msg.sender);
    }

    function repairCard(uint256 targetTokenId, uint256 fuelTokenId) external nonReentrant {
        require(cardNFT.ownerOf(targetTokenId) == msg.sender, "Not target owner");
        require(cardNFT.ownerOf(fuelTokenId) == msg.sender, "Not fuel owner");
        require(targetTokenId != fuelTokenId, "Cannot feed card to itself");

        // Force them to burn a Common card to repair
        ( , uint8 fuelRarity, , , , , ) = cardNFT.getCardAttributes(fuelTokenId);
        require(fuelRarity == RarityLogic.COMMON, "Repair fuel must be Common");

        // Burn the fuel and reset the clock on the target card
        cardNFT.burn(fuelTokenId);
        cardNFT.refreshCard(targetTokenId);
    }

    function getPlayerCombinationCount(address player) external view returns (uint256) { return playerCombinationCount[player]; }
}