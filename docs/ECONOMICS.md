# Economic Model

## Overview

The game operates a **pure NFT economy** — there is no ERC-20 game token. All costs are paid in cards (burned as fuel). This eliminates token volatility risk and keeps the economy fully on-chain and self-contained.

---

## Combination Costs (Burn-and-Mint)

When two cards are combined, both input cards are permanently burned. Higher-rarity combinations also require fuel cards:

| Highest input rarity | Fuel required |
|---|---|
| Common | 0 fuel cards |
| Rare | 1 Common |
| Epic | 2 Common |
| Legendary | 3 Common |

> Fuel cards are Common-rarity cards burned alongside the two combination inputs.

## Fuse / Unfuse Costs

| Action | Cost |
|---|---|
| Fuse | Free (cards are locked, not burned) |
| Unfuse | Free (cards are unlocked, wrapper burned) |

---

## Repair Costs

Repair resets a card's decay clock by burning a fuel card. Fuel rarity scales with the card being repaired:

| Target rarity | Fuel required |
|---|---|
| Rare | 1 Common |
| Epic | 1 Rare |
| Legendary | 1 Rare |

> Common cards are fully exempt from decay and cannot be repaired (no need).

---

## Decay System (Anti-Hoarding)

Rare, Epic, and Legendary cards lose stats over time if left unrepaired:

- **Rate**: -1 ATK and -1 DEF per 7,200 blocks (~24 hours on Ethereum mainnet)
- **Floor**: 75% of the card's base stats (max 25% loss)
- **Reset**: Calling `repairCard` burns the fuel card and resets the decay clock to the current block

This creates ongoing demand for Common cards (as repair fuel) and incentivises active play.

---

## Supply Dynamics

### Deflationary Pressure

- Every burn-and-mint combination removes 2 cards + N fuel cards from supply
- Every repair removes 1 fuel card from supply
- Cards burned due to irreversible combination accumulate as permanent supply reduction

### Inflationary Inputs

- Owner/manager minting of new base cards
- Seasonal / promo mints via `mintSeasonalPromo`

### Supply by Rarity

- Tracked on-chain: `CardNFT.getTotalSupplyByRarity(rarity)`
- Tracked on-chain: `CardNFT.getTotalSupplyByElement(element)`

---

## Combination Outcome Probabilities

Rarity outcomes are pseudorandom (seeded by `block.timestamp + sender + input rarities`). Production deployments should replace this with Chainlink VRF.

| Input combination | Possible outcomes |
|---|---|
| Common + Common | Common (50%) / Rare (50%) |
| Common + Rare | Rare (100%) |
| Common + Epic | Rare (70%) / Epic (30%) |
| Common + Legendary | Epic (100%) |
| Rare + Rare | Rare (40%) / Epic (60%) |
| Rare + Epic | Epic (100%) |
| Rare + Legendary | Epic (70%) / Legendary (30%) |
| Epic + Epic | Epic (20%) / Legendary (80%) |
| Epic + Legendary | Legendary (100%) |
| Legendary + Legendary | Legendary (100%) |

---

## Player Economy

### Entry

- Players receive base cards from the owner/manager (no on-chain purchase mechanism currently)
- No entry fee enforced at the contract level

### Value Sources

- Higher-rarity cards have stronger base stats
- Rarity is scarce by construction (upgrade paths require burning lower-rarity cards)
- Fused cards can be unfused — zero risk of permanent loss for the fuse path

### Costs to Players

- Burning cards to combine (irreversible)
- Burning fuel cards to repair high-value cards
- Gas costs for all transactions

---

## Anti-Abuse

| Measure | Implementation |
|---|---|
| Combine cooldown | `COOLDOWN_BLOCKS = 100` (~20 min) per player |
| Max generation cap | `MAX_GENERATION = 5` — prevents infinite compounding |
| Decay system | Discourages hoarding high-rarity cards without engagement |
| Locked card transfers | Fused cards cannot be transferred while locked |
| Fuel rarity matching | Repair cost scales with card value, preventing cheap resets |
