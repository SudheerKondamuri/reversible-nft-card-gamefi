// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RarityLogic
 * @dev Library for managing card rarity and drop rates
 */
library RarityLogic {
    // Rarity tiers
    uint8 public constant COMMON = 0;
    uint8 public constant UNCOMMON = 1;
    uint8 public constant RARE = 2;
    uint8 public constant EPIC = 3;
    uint8 public constant LEGENDARY = 4;

    /**
     * @dev Get rarity name string
     * @param rarity Rarity tier
     * @return name Rarity name
     */
    function getRarityName(uint8 rarity) internal pure returns (string memory) {
        if (rarity == COMMON) return "Common";
        if (rarity == UNCOMMON) return "Uncommon";
        if (rarity == RARE) return "Rare";
        if (rarity == EPIC) return "Epic";
        if (rarity == LEGENDARY) return "Legendary";
        return "Unknown";
    }

    /**
     * @dev Calculate rarity from fusion
     * @param rarities Array of input card rarities
     * @return newRarity Resulting rarity
     */
    function calculateFusionRarity(
        uint8[] calldata rarities
    ) internal pure returns (uint8) {
        // TODO: Implement rarity fusion logic
        uint8 maxRarity = 0;
        for (uint256 i = 0; i < rarities.length; i++) {
            if (rarities[i] > maxRarity) maxRarity = rarities[i];
        }
        return maxRarity;
    }

    /**
     * @dev Get drop probability for rarity (in basis points)
     * @param rarity Rarity tier
     * @return probability Probability in basis points (10000 = 100%)
     */
    function getDropProbability(uint8 rarity) internal pure returns (uint16) {
        // TODO: Implement drop rate table
        if (rarity == COMMON) return 6000; // 60%
        if (rarity == UNCOMMON) return 2500; // 25%
        if (rarity == RARE) return 1000; // 10%
        if (rarity == EPIC) return 400; // 4%
        if (rarity == LEGENDARY) return 100; // 1%
        return 0;
    }
}
