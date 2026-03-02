// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AttributeCalculator
 * @dev Library for calculating card attributes based on rarity and level
 */
library AttributeCalculator {
    // Rarity tiers: 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary
    uint8 public constant COMMON = 0;
    uint8 public constant UNCOMMON = 1;
    uint8 public constant RARE = 2;
    uint8 public constant EPIC = 3;
    uint8 public constant LEGENDARY = 4;

    /**
     * @dev Calculate base power attribute
     * @param rarity Card rarity tier
     * @param level Card level
     * @return power Calculated power value
     */
    function calculatePower(
        uint8 rarity,
        uint8 level
    ) internal pure returns (uint8) {
        // TODO: Implement power calculation formula
        return uint8(50 + rarity * 20 + level * 5);
    }

    /**
     * @dev Calculate base defense attribute
     * @param rarity Card rarity tier
     * @param level Card level
     * @return defense Calculated defense value
     */
    function calculateDefense(
        uint8 rarity,
        uint8 level
    ) internal pure returns (uint8) {
        // TODO: Implement defense calculation formula
        return uint8(40 + rarity * 15 + level * 3);
    }

    /**
     * @dev Get base stats from rarity
     * @param rarity Card rarity tier
     * @return power Base power value
     * @return defense Base defense value
     */
    function getBaseStats(
        uint8 rarity
    ) internal pure returns (uint8 power, uint8 defense) {
        // TODO: Implement base stats table
        power = uint8(50 + rarity * 20);
        defense = uint8(40 + rarity * 15);
    }
}
