// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/ICardNFT.sol";

contract CardNFT is ERC721, Ownable, ICardNFT {

    using Strings for uint256;
    using Strings for uint16;
    using Strings for uint8;

    uint256 private _tokenIdCounter;

    mapping(uint256 => Card) private _cards;
    mapping(uint8 => uint256) private _supplyByRarity;
    mapping(string => uint256) private _supplyByElement;
    
    // Security: Stop locked cards from being traded
    mapping(uint256 => bool) public isLocked;
    
    mapping(address => bool) public isManager;

    // Base URI for card images (e.g. ipfs://QmFolderCID/)
    string private _baseImageURI;

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

    // Set the base image URI (e.g. "ipfs://QmFolderCID/")
    // Images will be resolved as: baseImageURI + cardName + ".png"
    function setBaseImageURI(string memory baseImageURI) external onlyOwner {
        _baseImageURI = baseImageURI;
    }

    function getBaseImageURI() public view returns (string memory) {
        return _baseImageURI;
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
        uint8 generation,
        uint256 parentId1,
        uint256 parentId2
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
            lastUpdatedBlock: block.number,
            parentId1: parentId1,
            parentId2: parentId2
        });

        _supplyByRarity[rarity]++;
        _supplyByElement[element]++;

        emit CardMinted(tokenId, to, name, rarity, element);
        emit SupplyUpdated(rarity, _supplyByRarity[rarity]);

        return tokenId;
    }

    function mintCard(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability) external onlyManagerOrOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, 0, 0, 0);
    }

    function mintCardWithGen(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability, uint8 generation) external onlyManagerOrOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, generation, 0, 0);
    }

    function mintCardWithGenAndParents(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability, uint8 generation, uint256 parentId1, uint256 parentId2) external onlyManagerOrOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, generation, parentId1, parentId2);
    }

    function mintSeasonalPromo(address to, string memory name, uint8 rarity, string memory element, uint16 attack, uint16 defense, string memory ability) external onlyOwner returns (uint256) {
        return _mintCardInternal(to, name, rarity, element, attack, defense, ability, 0, 0, 0);
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

        // Anti-Hoarding Mechanism: Decay System — only for Rare+ (capped at 75% of base stat, 1 point per ~24h)
        uint16 currentAttack = card.attack;
        uint16 currentDefense = card.defense;
        if (card.rarity > 1) {
            uint256 blocksPassed = block.number - card.lastUpdatedBlock;
            uint16 decay = uint16(blocksPassed / 7200);

            uint16 minAttack = card.attack * 75 / 100;
            currentAttack = card.attack > decay ? card.attack - decay : minAttack;
            if (currentAttack < minAttack) currentAttack = minAttack;

            uint16 minDefense = card.defense * 75 / 100;
            currentDefense = card.defense > decay ? card.defense - decay : minDefense;
            if (currentDefense < minDefense) currentDefense = minDefense;
        }

        return (card.name, card.rarity, card.element, currentAttack, currentDefense, card.ability, card.generation);
    }

    function refreshCard(uint256 tokenId) external onlyManagerOrOwner {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        _cards[tokenId].lastUpdatedBlock = block.number;
    }

    function getLastUpdatedBlock(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _cards[tokenId].lastUpdatedBlock;
    }

    // ─── On-chain tokenURI with dynamic metadata + IPFS images ───

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        Card memory card = _cards[tokenId];

        // Apply decay for current stats — only for Rare+ (capped at 75% of base stat, 1 point per ~24h)
        uint16 currentAttack = card.attack;
        uint16 currentDefense = card.defense;
        if (card.rarity > 1) {
            uint256 blocksPassed = block.number - card.lastUpdatedBlock;
            uint16 decay = uint16(blocksPassed / 7200);

            uint16 minAttack = card.attack * 75 / 100;
            currentAttack = card.attack > decay ? card.attack - decay : minAttack;
            if (currentAttack < minAttack) currentAttack = minAttack;

            uint16 minDefense = card.defense * 75 / 100;
            currentDefense = card.defense > decay ? card.defense - decay : minDefense;
            if (currentDefense < minDefense) currentDefense = minDefense;
        }

        string memory imageURI = string(abi.encodePacked(_baseImageURI, card.name, ".png"));

        string memory json = string(abi.encodePacked(
            '{"name":"', card.name, ' #', tokenId.toString(), '",'
            '"description":"A ', _rarityToString(card.rarity), ' ', card.element, ' element card with ', uint256(currentAttack).toString(), ' ATK / ', uint256(currentDefense).toString(), ' DEF",'
            '"image":"', imageURI, '",'
            '"attributes":', _buildAttributes(card, currentAttack, currentDefense),
            '}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function _buildAttributes(Card memory card, uint16 currentAttack, uint16 currentDefense) internal view returns (string memory) {
        // Build base attributes
        string memory attrs = string(abi.encodePacked(
            '[',
            '{"trait_type":"Element","value":"', card.element, '"},',
            '{"trait_type":"Rarity","value":"', _rarityToString(card.rarity), '"},',
            '{"trait_type":"Attack","display_type":"number","value":', uint256(currentAttack).toString(), '},',
            '{"trait_type":"Defense","display_type":"number","value":', uint256(currentDefense).toString(), '},',
            '{"trait_type":"Generation","display_type":"number","value":', uint256(card.generation).toString(), '},',
            '{"trait_type":"Special Ability","value":"', card.ability, '"}'
        ));

        // Add parent card references if this is a fusion/combination card
        if (card.parentId1 != 0 && card.parentId2 != 0) {
            string memory parent1Name = _cards[card.parentId1].name;
            string memory parent2Name = _cards[card.parentId2].name;
            // Fallback if parent was burned (combine destroys originals)
            if (bytes(parent1Name).length == 0) parent1Name = string(abi.encodePacked("Card #", card.parentId1.toString()));
            if (bytes(parent2Name).length == 0) parent2Name = string(abi.encodePacked("Card #", card.parentId2.toString()));

            attrs = string(abi.encodePacked(
                attrs,
                ',{"trait_type":"Parent Card 1","value":"', parent1Name, ' #', card.parentId1.toString(), '"}',
                ',{"trait_type":"Parent Card 2","value":"', parent2Name, ' #', card.parentId2.toString(), '"}'
            ));
        }

        return string(abi.encodePacked(attrs, ']'));
    }

    function _rarityToString(uint8 rarity) internal pure returns (string memory) {
        if (rarity == 1) return "Common";
        if (rarity == 2) return "Rare";
        if (rarity == 3) return "Epic";
        if (rarity == 4) return "Legendary";
        return "Unknown";
    }

    // ─── Supply tracking ───

    function getTotalSupplyByRarity(uint8 rarity) external view returns (uint256) { return _supplyByRarity[rarity]; }
    function getTotalSupplyByElement(string memory element) external view returns (uint256) { return _supplyByElement[element]; }
    function totalMinted() external view returns (uint256) { return _tokenIdCounter; }
}