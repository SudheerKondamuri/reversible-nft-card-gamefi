// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ICardNFT
 * @dev Interface for Card NFT with reversible fusion mechanics
 */
interface ICardNFT {
    // Events
    event CardMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint8 element,
        uint8 rarity
    );
    event CardFused(uint256[] indexed tokenIds, uint256 indexed newTokenId);
    event CardReversed(
        uint256 indexed tokenId,
        uint256[] indexed componentTokenIds
    );
    event AttributesUpdated(
        uint256 indexed tokenId,
        uint8 power,
        uint8 defense
    );

    // Card Struct
    struct Card {
        uint8 element;
        uint8 rarity;
        uint8 power;
        uint8 defense;
        uint256[] fusedCards;
        bool isComposite;
    }

    // Core Functions
    function mint(
        address to,
        uint8 element,
        uint8 rarity
    ) external returns (uint256);

    function fuse(uint256[] calldata cardIds) external returns (uint256);

    function reverse(uint256 tokenId) external returns (uint256[] memory);

    function getCard(uint256 tokenId) external view returns (Card memory);

    function getCardAttributes(
        uint256 tokenId
    ) external view returns (uint8 power, uint8 defense);
}
