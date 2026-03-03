// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ElementMatrix.sol";
import "./RarityLogic.sol";

library AttributeCalculator {
    function calculateAttack(
        uint16 attr1, 
        uint16 attr2, 
        uint8 rarity1, 
        uint8 rarity2, 
        uint16 elementBonus, 
        uint8 newGeneration
    ) internal pure returns (uint16) {
        uint8 rarityBonus = RarityLogic.max(rarity1, rarity2);
        uint16 base = (attr1 + attr2) / 2;
        
        uint16 result = base + rarityBonus + elementBonus;
        
        if (newGeneration > 0) {
            if (result > newGeneration) {
                result -= newGeneration;
            } else {
                result = 1; // Minimum stat
            }
        }
        
        return result == 0 ? 1 : result;
    }

    function calculateDefense(
        uint16 attr1, 
        uint16 attr2, 
        uint8 rarity1, 
        uint8 rarity2, 
        uint16 elementBonus, 
        uint8 newGeneration
    ) internal pure returns (uint16) {
        return calculateAttack(attr1, attr2, rarity1, rarity2, elementBonus, newGeneration);
    }
}
