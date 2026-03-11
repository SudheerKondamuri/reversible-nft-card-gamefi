# Reversible NFT Card GameFi — Design Documentation

## Overview

A blockchain-based card game featuring dual-layer NFT combination mechanics: a deflationary **burn-and-mint** path and a reversible **fuse/unfuse** path. Cards decay over time to discourage hoarding, and players can repair cards by sacrificing fuel cards.

---

## Architecture

### Core Contracts

#### `CardNFT.sol` (ERC721)

- Mints, burns, locks/unlocks, and refreshes cards
- Stores on-chain metadata (name, rarity, element, attack, defense, ability, generation, parentIds)
- Dynamic `tokenURI` with Base64-encoded JSON and IPFS image references
- Tracks `lastUpdatedBlock` per card for the decay system
- Access controlled by `onlyManagerOrOwner` modifier

#### `CombinationManager.sol`

- **Combine** (burn-and-mint): burns both input cards, mints a new composite card
- **Fuse**: locks both input cards in escrow, mints a fused wrapper token
- **Unfuse**: burns the wrapper, unlocks and returns both original cards
- **Repair**: burns a fuel card to reset the target card's decay clock
- Enforces per-player cooldowns (`COOLDOWN_BLOCKS = 100`) and max generation (`MAX_GENERATION = 5`)

### Supporting Libraries

| Library | Responsibility |
|---|---|
| `ElementMatrix` | 14-element combination table → result element, name, ability, stat bonuses |
| `AttributeCalculator` | Calculates attack/defense from parent stats, rarity bonuses, element bonuses, generation penalty |
| `RarityLogic` | Rarity constants (1–4), pseudorandom rarity outcome for combinations |

---

## Card System

### Elements (14)

`Fire`, `Water`, `Earth`, `Air`, `Lightning`, `Steam`, `Lava`, `Nature`, `Ice`, `Dust`, `Plasma`, `Storm`, `Magnetism`, `Thunder`

### Rarity Tiers (4)

| Value | Name | Badge colour |
|---|---|---|
| 1 | Common | Gray |
| 2 | Rare | Blue |
| 3 | Epic | Purple |
| 4 | Legendary | Gold |

### Card Struct (on-chain)

```solidity
struct Card {
    string  name;
    uint8   rarity;           // 1-4
    string  element;
    uint16  attack;
    uint16  defense;
    string  ability;
    uint8   generation;       // 0 = base, max 5
    uint256 lastUpdatedBlock; // decay clock
    uint256 parentId1;
    uint256 parentId2;
}
```

---

## Combination System

### Burn-and-Mint (Combine)

1. Player selects two eligible cards (same owner, not locked, generation < 5)
2. Optional fuel cards required for higher-rarity combinations (Common fuel cards burned)
3. Both input cards are permanently burned
4. A new card is minted with calculated stats and a new element based on `ElementMatrix`
5. `COOLDOWN_BLOCKS` enforced between combinations per player

### Fuse / Unfuse

1. Both cards are **locked** (non-transferable) and a fused wrapper NFT is minted
2. Player retains the wrapper; both originals remain in their wallet but are locked
3. **Unfuse** burns the wrapper and unlocks both originals — fully reversible at any time

---

## Decay System

> **Only Rare, Epic, and Legendary cards decay. Common cards are fully exempt.**

- Decay rate: **-1 attack & -1 defense per 7,200 blocks** (~24 hours on Ethereum mainnet at 12 s/block)
- Hard floor: **75% of base stats** — a card can never lose more than 25% of its original stats
- `lastUpdatedBlock` is read-only from the frontend via `getLastUpdatedBlock(tokenId)`
- Stats are computed dynamically in `getCardAttributes()` and `tokenURI()` — nothing is stored mutably

### Repair

| Target rarity | Required fuel rarity |
|---|---|
| Rare | Common |
| Epic | Rare |
| Legendary | Rare |

Repair calls `CombinationManager.repairCard(targetTokenId, fuelTokenId)`, which burns the fuel card and resets `lastUpdatedBlock` on the target via `CardNFT.refreshCard()`.

---

## Attribute Calculation

```
base        = (parent1.attack + parent2.attack) / 2
rarityBonus = max(rarity1, rarity2)
attack      = base + rarityBonus + elementBonus - generationPenalty  (min 1)
```

Defense uses the identical formula. Generation penalty discourages infinite compounding.

---

## Frontend (Next.js 14)

| Route | Feature |
|---|---|
| `/dashboard` | Card collection, filters, rarity chart |
| `/combine` | Burn-and-mint or fuse mode selector |
| `/unfuse` | Unfuse fused cards with cooldown timer |
| `/repair` | Decay dashboard with block progress bars and fuel selection |
| `/stats` | Supply analytics by rarity and element |
| `/admin` | Owner-only mint and configuration |

### Key Hooks

- `usePlayerCards` — fetches owned cards + `lastUpdatedBlock` for Rare+ cards
- `useCombinationContract` — combine, fuse, unfuse, repairCard write hooks
- `useCombinationPreview` — live stat preview before combining
- `useContractEvents` — live event feed

---

## Future Enhancements

- [ ] Chainlink VRF for rarity randomness (currently pseudorandom via block data)
- [ ] Battling / PvP system
- [ ] Trading marketplace
- [ ] Staking mechanics
- [ ] Seasonal / promo card events
- [ ] Cross-game compatibility
