# Reversible NFT Card GameFi - Design Documentation

## Overview

A blockchain-based card game featuring reversible NFT fusion mechanics, allowing players to combine and decompose cards while earning game economy rewards.

## Architecture

### Core Components

#### 1. CardNFT Contract

- ERC721-based NFT implementation
- Supports base cards and composite cards
- Reversible fusion mechanics
- Attributes: Element, Rarity, Power, Defense

#### 2. CombinationManager Contract

- Manages fusion rules and constraints
- Handles game economics
- Calculates rewards and bonuses
- Controls fusion costs

#### 3. Supporting Libraries

- **ElementMatrix**: Element advantage system and combination logic
- **AttributeCalculator**: Stat calculation based on rarity and level
- **RarityLogic**: Rarity tiers and drop rate management

## Game Mechanics

### Card System

- **Elements**: Fire, Water, Earth, Air, Light, Dark
- **Rarity Tiers**: Common → Uncommon → Rare → Epic → Legendary
- **Attributes**: Power, Defense (calculated from rarity)

### Fusion System

- Combine 2+ cards into a single composite card
- New card gains bonuses based on input cards
- Fusion cost depends on rarity and element combination
- Rewards awarded upon successful fusion

### Reversal System

- Decompose composite cards back to original components
- Preserve component card integrity
- Return fusion value to player
- Component cards remain unchanged

## Economic Model

### Costs

- TODO: Define fusion cost formula
- TODO: Define element-specific multipliers
- TODO: Define rarity-based scaling

### Rewards

- Base rewards per fusion
- Rarity multipliers
- Element bonus multipliers
- Compound rewards for complex fusions

### Token Distribution

- Reward token (TODO: specify)
- Claim mechanics
- Distribution schedule

## Data Structures

### Card Struct

```solidity
struct Card {
    uint8 element;
    uint8 rarity;
    uint8 power;
    uint8 defense;
    uint256[] fusedCards;
    bool isComposite;
}
```

### CombinationRule Struct

```solidity
struct CombinationRule {
    uint8[] requiredElements;
    uint8 minRarity;
    uint256 fusionCost;
    uint8 resultElement;
    uint16 bonusMultiplier;
}
```

## Integration Points

- TODO: External reward token
- TODO: Oracle for randomization
- TODO: Off-chain metadata service
- TODO: Game server for state validation

## Future Enhancements

- [ ] Battling system
- [ ] Trading marketplace
- [ ] Staking mechanics
- [ ] Seasonal events
- [ ] Special editions
- [ ] Cross-game compatibility
