// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICardNFT.sol";

contract CardNFT is ERC721, Ownable, ICardNFT {

    uint256 private _tokenIdCounter;

    mapping(uint256 => Card) private _cards;
    mapping(uint8 => uint256) private _supplyByRarity;
    mapping(string => uint256) private _supplyByElement;
    
    // Security: Stop locked cards from being traded
    mapping(uint256 => bool) public isLocked;
    
    mapping(address => bool) public isManager;

    modifier onlyManagerOrOwner() {
        require(owner() == _msgSender() || isManager[_msgSender()], "Not authorized");
        _;
    }

    constructor() 
        ERC721("GameFiCard", "GFC") 
        Ownable(msg.sender) 
    {}

    function setManager(address manager, bool status) external onlyOwner {
        isManager[manager] = status;
    }

    function lockCard(uint256 tokenId) external onlyManagerOrOwner {
        isLocked[tokenId] = true;
    }

    function unlockCard(uint256 tokenId) external onlyManagerOrOwner {
        isLocked[tokenId] = false;
    }

    // Prevent transfer of locked cards
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        require(!isLocked[tokenId], "Card is locked in escrow");
        return super._update(to, tokenId, auth);
    }

    function _mintCardInternal(
        address to,
        string memory name,
        uint8 rarity,
        string memory element,
        uint16 attack,
        uint16 defense,
        string memory ability,
        uint8 generation
    ) internal returns (uint256) {
        require(rarity >= 1 && rarity <= 4, "Invalid rarity");
        require(attack > 0 && defense > 0, "Invalid stats");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);

        _cards[tokenId] = Card({
            name: name,
            rarity: rarity,
            element: element,
            attack: attack,
            defense: defense,
            ability: ability,
            generation: generation,
            lastUpdatedBlock: block.number
        });

        _supplyByRarity[rarity]++;
        _supplyByElement[element]++;

        emit CardMinted(tokenId, to, name, rarity, element);
        emit SupplyUpdated(rarity, _supplyByRarity[rarity]);

        return tokenId;
    }

    function mintCard(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability) external onlyManagerOrOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, 0);
    }

    function mintCardWithGen(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability, uint8 generation) external onlyManagerOrOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, generation);
    }

    function mintSeasonalPromo(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability) external onlyOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, 0);
    }

    function burn(uint256 tokenId) external onlyManagerOrOwner {
        Card memory card = _cards[tokenId];
        _supplyByRarity[card.rarity]--;
        _supplyByElement[card.element]--;
        delete _cards[tokenId];
        _burn(tokenId);
        emit CardBurned(tokenId);
        emit SupplyUpdated(card.rarity, _supplyByRarity[card.rarity]);
    }

    function getCardAttributes(uint256 tokenId) 
        external view returns (
            string memory name,
            uint8 rarity,
            string memory element,
            uint16 attack,
            uint16 defense,
            string memory ability,
            uint8 generation
        ) 
    {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        Card memory card = _cards[tokenId];

        // Anti-Hoarding Mechanism: Decay System
        uint256 blocksPassed = block.number - card.lastUpdatedBlock;
        uint16 decay = uint16(blocksPassed / 1000);
        
        uint16 currentAttack = card.attack > decay ? card.attack - decay : 1;
        if (currentAttack == 0) currentAttack = 1;
        
        uint16 currentDefense = card.defense > decay ? card.defense - decay : 1;
        if (currentDefense == 0) currentDefense = 1;

        return (card.name, card.rarity, card.element, currentAttack, currentDefense, card.ability, card.generation);
    }


    function refreshCard(uint256 tokenId) external onlyManagerOrOwner {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        _cards[tokenId].lastUpdatedBlock = block.number;
    }

    function getTotalSupplyByRarity(uint8 rarity) external view returns (uint256) { return _supplyByRarity[rarity]; }
    function getTotalSupplyByElement(string memory element) external view returns (uint256) { return _supplyByElement[element]; }
    function totalMinted() external view returns (uint256) { return _tokenIdCounter; }
}