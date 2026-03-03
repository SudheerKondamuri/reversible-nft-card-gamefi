// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ElementMatrix {
    struct CombinationResult {
        string newElement;
        uint16 attackBonus;
        uint16 defenseBonus;
        string newAbility;
    }

    // Helper to compare strings
    function equals(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // Gets the combination result for two elements. Order does NOT matter.
    function getCombination(string memory e1, string memory e2) internal pure returns (CombinationResult memory) {
        // Normalize order purely for checking easily
        string memory a;
        string memory b;
        if (keccak256(abi.encodePacked(e1)) < keccak256(abi.encodePacked(e2))) {
            a = e1; b = e2;
        } else {
            a = e2; b = e1;
        }

        if (equals(a, "Fire") && equals(b, "Fire")) return CombinationResult("Fire", 3, 0, "Double Flame");
        if (equals(a, "Fire") && equals(b, "Water")) return CombinationResult("Steam", 1, 1, "Obscure: Reduce opponent's accuracy by 20%");
        if (equals(a, "Earth") && equals(b, "Fire")) return CombinationResult("Lava", 2, 1, "Molten: Burn opponent for 2 damage per turn");
        if (equals(a, "Air") && equals(b, "Fire")) return CombinationResult("Lightning", 4, 0, "Shock: 30% chance to stun");
        if (equals(a, "Water") && equals(b, "Water")) return CombinationResult("Water", 0, 3, "Tidal Wave");
        if (equals(a, "Earth") && equals(b, "Water")) return CombinationResult("Nature", 0, 2, "Regenerate: Heal 1 HP per turn");
        if (equals(a, "Air") && equals(b, "Water")) return CombinationResult("Ice", 1, 1, "Freeze: Reduce opponent speed by 50%");
        if (equals(a, "Earth") && equals(b, "Earth")) return CombinationResult("Earth", 0, 4, "Diamond Skin");
        if (equals(a, "Air") && equals(b, "Earth")) return CombinationResult("Dust", 1, 1, "Blind: 30% enemy miss chance");
        if (equals(a, "Air") && equals(b, "Air")) return CombinationResult("Air", 2, 2, "Tornado");
        if (equals(a, "Fire") && equals(b, "Lightning")) return CombinationResult("Plasma", 5, 0, "Unstable: Random damage 15-25");
        if (equals(a, "Lightning") && equals(b, "Water")) return CombinationResult("Storm", 3, 3, "Chaos: Random effects each turn");
        if (equals(a, "Earth") && equals(b, "Lightning")) return CombinationResult("Magnetism", 2, 2, "Control: Pull opponent cards to you");
        if (equals(a, "Air") && equals(b, "Lightning")) return CombinationResult("Thunder", 6, 0, "Sonic: Cannot be blocked");
        if (equals(a, "Lightning") && equals(b, "Lightning")) return CombinationResult("Lightning", 4, 2, "Overload");

        // Fallback for missing combos
        return CombinationResult(a, 0, 0, "Mismatched");
    }
}
