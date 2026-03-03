// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library RarityLogic {
    uint8 public constant COMMON = 1;
    uint8 public constant RARE = 2;
    uint8 public constant EPIC = 3;
    uint8 public constant LEGENDARY = 4;

    function max(uint8 a, uint8 b) internal pure returns (uint8) {
        return a > b ? a : b;
    }

    // Pseudorandom generator for deterministic (but slightly variable) rarity combinations
    // Note: In production, VRF should be used
    function getResultRarity(uint8 r1, uint8 r2, uint256 blockTimestamp, address sender) internal pure returns (uint8) {
        uint8 minR = r1 < r2 ? r1 : r2;
        uint8 maxR = r1 > r2 ? r1 : r2;

        uint256 rand = uint256(keccak256(abi.encodePacked(blockTimestamp, sender, r1, r2))) % 100;

        if (minR == COMMON && maxR == COMMON) return rand < 50 ? COMMON : RARE; // 50/50
        if (minR == COMMON && maxR == RARE) return RARE;
        if (minR == COMMON && maxR == EPIC) return rand < 70 ? RARE : EPIC;
        if (minR == COMMON && maxR == LEGENDARY) return EPIC;

        if (minR == RARE && maxR == RARE) return rand < 40 ? RARE : EPIC;
        if (minR == RARE && maxR == EPIC) return EPIC;
        if (minR == RARE && maxR == LEGENDARY) return rand < 70 ? EPIC : LEGENDARY;

        if (minR == EPIC && maxR == EPIC) return rand < 20 ? EPIC : LEGENDARY;
        if (minR == EPIC && maxR == LEGENDARY) return LEGENDARY;

        if (minR == LEGENDARY && maxR == LEGENDARY) return LEGENDARY; // Mythic not fully spec'd

        return maxR; // Default fallback
    }
}
