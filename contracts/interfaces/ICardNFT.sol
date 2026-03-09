// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ICardNFT is IERC721 {
    struct Card {
        string name;
        uint8 rarity;
        string element;
        uint16 attack;
        uint16 defense;
        string ability;
        uint8 generation;
        uint256 lastUpdatedBlock; // Added for Decay System
        uint256 parentId1; // 0 = no parent (base card)
        uint256 parentId2; // 0 = no parent (base card)
    }

    event CardMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 rarity,
        string element
    );
    
    event CardBurned(uint256 indexed tokenId);

    event SupplyUpdated(
        uint8 indexed rarity,
        uint256 newSupply
    );

    function mintCard(
        address to,
        string memory name,
        uint8 rarity,
        string memory element,
        uint16 attack,
        uint16 defense,
        string memory ability
    ) external returns (uint256);

    function mintCardWithGen(
        address to,
        string memory name,
        uint8 rarity,
        string memory element,
        uint16 attack,
        uint16 defense,
        string memory ability,
        uint8 generation
    ) external returns (uint256);

    function mintCardWithGenAndParents(
        address to,
        string memory name,
        uint8 rarity,
        string memory element,
        uint16 attack,
        uint16 defense,
        string memory ability,
        uint8 generation,
        uint256 parentId1,
        uint256 parentId2
    ) external returns (uint256);

    // Anti-Deflation Mechanism: Seasonal Mints
    function mintSeasonalPromo(
        address to, 
        string memory name, 
        uint8 rarity, 
        string memory element, 
        uint16 attack, 
        uint16 defense, 
        string memory ability
    ) external returns (uint256);

    function burn(uint256 tokenId) external;

    // Escrow Lock controls
    function lockCard(uint256 tokenId) external;
    function unlockCard(uint256 tokenId) external;
    function isLocked(uint256 tokenId) external view returns (bool);

    function getCardAttributes(uint256 tokenId) 
        external view returns (
            string memory name,
            uint8 rarity,
            string memory element,
            uint16 attack,
            uint16 defense,
            string memory ability,
            uint8 generation
        );

    function getTotalSupplyByRarity(uint8 rarity) external view returns (uint256);
    function getTotalSupplyByElement(string memory element) external view returns (uint256);
    // Add this to CardNFT.sol
    function refreshCard(uint256 tokenId) external;

    function setBaseImageURI(string memory baseImageURI) external;
    function getBaseImageURI() external view returns (string memory);
}