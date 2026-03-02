// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/ICardNFT.sol";
import "./libraries/ElementMatrix.sol";
import "./libraries/AttributeCalculator.sol";
import "./libraries/RarityLogic.sol";

/**
 * @title CardNFT
 * @dev NFT card with reversible fusion mechanics for GameFi
 */
contract CardNFT is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable,
    ICardNFT
{
    // State variables
    mapping(uint256 => Card) public cards;
    uint256 public cardCounter;

    // Constructor
    constructor() ERC721("Card NFT", "CARD") {}

    /**
     * @dev Mint a new card
     * @param to Recipient address
     * @param element Card element type
     * @param rarity Card rarity tier
     * @return tokenId Minted card ID
     */
    function mint(
        address to,
        uint8 element,
        uint8 rarity
    ) external onlyOwner returns (uint256) {
        // TODO: Implement minting logic
        uint256 tokenId = cardCounter++;
        _safeMint(to, tokenId);

        Card storage card = cards[tokenId];
        card.element = element;
        card.rarity = rarity;
        card.isComposite = false;

        (card.power, card.defense) = AttributeCalculator.getBaseStats(rarity);

        emit CardMinted(to, tokenId, element, rarity);
        return tokenId;
    }

    /**
     * @dev Fuse multiple cards into one composite card
     * @param cardIds Array of card IDs to fuse
     * @return newTokenId ID of the resulting composite card
     */
    function fuse(uint256[] calldata cardIds) external returns (uint256) {
        // TODO: Implement fusion logic
        require(cardIds.length >= 2, "Minimum 2 cards required for fusion");

        // Check ownership and validity
        for (uint256 i = 0; i < cardIds.length; i++) {
            require(ownerOf(cardIds[i]) == msg.sender, "Not card owner");
        }

        // Create composite card
        uint256 newTokenId = cardCounter++;
        _safeMint(msg.sender, newTokenId);

        Card storage newCard = cards[newTokenId];
        newCard.isComposite = true;
        newCard.fusedCards = cardIds;

        // TODO: Calculate attributes from fused cards

        emit CardFused(cardIds, newTokenId);
        return newTokenId;
    }

    /**
     * @dev Reverse a composite card back to original components
     * @param tokenId ID of composite card to reverse
     * @return componentTokenIds Array of original card IDs
     */
    function reverse(uint256 tokenId) external returns (uint256[] memory) {
        // TODO: Implement reverse logic
        require(ownerOf(tokenId) == msg.sender, "Not card owner");
        require(cards[tokenId].isComposite, "Card is not composite");

        uint256[] memory components = cards[tokenId].fusedCards;

        // Burn composite card
        _burn(tokenId);

        emit CardReversed(tokenId, components);
        return components;
    }

    /**
     * @dev Get card data
     * @param tokenId Card ID
     * @return Card struct
     */
    function getCard(uint256 tokenId) external view returns (Card memory) {
        require(_exists(tokenId), "Card does not exist");
        return cards[tokenId];
    }

    /**
     * @dev Get card attributes
     * @param tokenId Card ID
     * @return power Card power value
     * @return defense Card defense value
     */
    function getCardAttributes(
        uint256 tokenId
    ) external view returns (uint8 power, uint8 defense) {
        require(_exists(tokenId), "Card does not exist");
        return (cards[tokenId].power, cards[tokenId].defense);
    }

    // Internal overrides
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721Burnable) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
