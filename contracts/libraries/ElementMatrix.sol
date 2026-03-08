// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ElementMatrix {
    struct CombinationResult {
        string newElement;
        string newName;
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

        // Same-element combinations
        if (equals(a, "Fire") && equals(b, "Fire")) return CombinationResult("Fire", "Inferno Champion", 3, 0, "Double Flame: Deal double burn damage");
        if (equals(a, "Water") && equals(b, "Water")) return CombinationResult("Water", "Deep Sea Monarch", 0, 3, "Tidal Wave: Push all opponents back");
        if (equals(a, "Earth") && equals(b, "Earth")) return CombinationResult("Earth", "Stone Fortress", 0, 4, "Diamond Skin: Reduce all incoming damage by 3");
        if (equals(a, "Air") && equals(b, "Air")) return CombinationResult("Air", "Sky Sovereign", 2, 2, "Tornado: Attack all opponents simultaneously");
        if (equals(a, "Lightning") && equals(b, "Lightning")) return CombinationResult("Lightning", "Zeus Reborn", 4, 2, "Overload: Chain lightning hits all enemies");

        // Cross-element combinations
        if (equals(a, "Fire") && equals(b, "Water")) return CombinationResult("Steam", "Steam Golem", 1, 1, "Obscure: Reduce opponent accuracy by 20%");
        if (equals(a, "Earth") && equals(b, "Fire")) return CombinationResult("Lava", "Lava Titan", 2, 1, "Molten: Burn opponent for 2 damage per turn");
        if (equals(a, "Air") && equals(b, "Fire")) return CombinationResult("Lightning", "Thunder Striker", 4, 0, "Shock: 30% chance to stun");
        if (equals(a, "Earth") && equals(b, "Water")) return CombinationResult("Nature", "Nature Warden", 0, 2, "Regenerate: Heal 1 HP per turn");
        if (equals(a, "Air") && equals(b, "Water")) return CombinationResult("Ice", "Frost Sentinel", 1, 1, "Freeze: Reduce opponent speed by 50%");
        if (equals(a, "Air") && equals(b, "Earth")) return CombinationResult("Dust", "Dust Phantom", 1, 1, "Blind: 30% enemy miss chance");

        // Lightning cross-element combinations
        if (equals(a, "Fire") && equals(b, "Lightning")) return CombinationResult("Plasma", "Plasma Core", 5, 0, "Unstable: Random damage 15-25");
        if (equals(a, "Lightning") && equals(b, "Water")) return CombinationResult("Storm", "Storm Herald", 3, 3, "Chaos: Random effects each turn");
        if (equals(a, "Earth") && equals(b, "Lightning")) return CombinationResult("Magnetism", "Magnetic Colossus", 2, 2, "Control: Pull opponent cards to you");
        if (equals(a, "Air") && equals(b, "Lightning")) return CombinationResult("Thunder", "Thunder Lord", 6, 0, "Sonic: Cannot be blocked");

        // Fallback for undefined combos
        return CombinationResult(a, "Unknown Entity", 0, 0, "Mismatched: Unstable combination");
    }
}
