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

    // Helper to check if two elements match regardless of order
    function isPair(string memory e1, string memory e2, string memory expected1, string memory expected2) internal pure returns (bool) {
        return (equals(e1, expected1) && equals(e2, expected2)) || (equals(e1, expected2) && equals(e2, expected1));
    }

    // Gets the combination result for two elements. Order does NOT matter.
    function getCombination(string memory e1, string memory e2) internal pure returns (CombinationResult memory) {
        // Same-element combinations
        if (equals(e1, "Fire") && equals(e2, "Fire")) return CombinationResult("Fire", "Inferno Champion", 3, 0, "Double Flame: Deal double burn damage");
        if (equals(e1, "Water") && equals(e2, "Water")) return CombinationResult("Water", "Deep Sea Monarch", 0, 3, "Tidal Wave: Push all opponents back");
        if (equals(e1, "Earth") && equals(e2, "Earth")) return CombinationResult("Earth", "Stone Fortress", 0, 4, "Diamond Skin: Reduce all incoming damage by 3");
        if (equals(e1, "Air") && equals(e2, "Air")) return CombinationResult("Air", "Sky Sovereign", 2, 2, "Tornado: Attack all opponents simultaneously");
        if (equals(e1, "Lightning") && equals(e2, "Lightning")) return CombinationResult("Lightning", "Zeus Reborn", 4, 2, "Overload: Chain lightning hits all enemies");

        // Cross-element combinations
        if (isPair(e1, e2, "Fire", "Water")) return CombinationResult("Steam", "Steam Golem", 1, 1, "Obscure: Reduce opponent accuracy by 20%");
        if (isPair(e1, e2, "Earth", "Fire")) return CombinationResult("Lava", "Lava Titan", 2, 1, "Molten: Burn opponent for 2 damage per turn");
        if (isPair(e1, e2, "Air", "Fire")) return CombinationResult("Lightning", "Thunder Striker", 4, 0, "Shock: 30% chance to stun");
        if (isPair(e1, e2, "Earth", "Water")) return CombinationResult("Nature", "Nature Warden", 0, 2, "Regenerate: Heal 1 HP per turn");
        if (isPair(e1, e2, "Air", "Water")) return CombinationResult("Ice", "Frost Sentinel", 1, 1, "Freeze: Reduce opponent speed by 50%");
        if (isPair(e1, e2, "Air", "Earth")) return CombinationResult("Dust", "Dust Phantom", 1, 1, "Blind: 30% enemy miss chance");

        // Lightning cross-element combinations
        if (isPair(e1, e2, "Fire", "Lightning")) return CombinationResult("Plasma", "Plasma Core", 5, 0, "Unstable: Random damage 15-25");
        if (isPair(e1, e2, "Lightning", "Water")) return CombinationResult("Storm", "Storm Herald", 3, 3, "Chaos: Random effects each turn");
        if (isPair(e1, e2, "Earth", "Lightning")) return CombinationResult("Magnetism", "Magnetic Colossus", 2, 2, "Control: Pull opponent cards to you");
        if (isPair(e1, e2, "Air", "Lightning")) return CombinationResult("Thunder", "Thunder Lord", 6, 0, "Sonic: Cannot be blocked");

        // Fallback for undefined combos
        return CombinationResult(e1, "Unknown Entity", 0, 0, "Mismatched: Unstable combination");
    }
}
