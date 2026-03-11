# Security Considerations

## Audit Checklist

- [x] Integer overflow/underflow protection (Solidity 0.8.28 built-in checked arithmetic)
- [x] Reentrancy attack prevention (`ReentrancyGuard.nonReentrant` on all state-changing functions)
- [x] Access control verification (`onlyManagerOrOwner`, `onlyOwner`)
- [x] Input validation for all sensitive functions
- [x] Checks-effects-interactions pattern applied
- [x] Proper event logging (`CardMinted`, `CardBurned`, `CardsCombined`, `CardsFused`, `CardUnfused`, `SupplyUpdated`)
- [x] Locked card transfer prevention (ERC721 `_update` override)
- [ ] Formal audit by external auditor
- [ ] Chainlink VRF for rarity randomness (currently pseudorandom)
- [ ] Emergency pause mechanism
- [ ] Timelock for owner upgrades

---

## Implemented Mitigations

### Reentrancy

**Risk**: Attacker re-enters `combineCards`, `fuseCards`, `unfuseCard`, or `repairCard` during execution.

**Mitigation**: All four functions in `CombinationManager` are guarded by OpenZeppelin `ReentrancyGuard.nonReentrant`. State changes complete before any external calls.

### Unauthorized Card Operations

**Risk**: Non-owner attempts to combine, fuse, or repair cards they don't own.

**Mitigation**: Every function in `CombinationManager` checks `cardNFT.ownerOf(tokenId) == msg.sender` before any state change.

### Locked Card Transfers

**Risk**: Cards locked in fuse escrow are sold or transferred, breaking unfuse integrity.

**Mitigation**: `CardNFT._update()` overrides the ERC721 transfer hook to `revert("Card is locked")` if `isLocked[tokenId] == true`. Locked cards cannot be transferred, listed, or traded.

### Access Control on Mint / Burn / Refresh

**Risk**: Arbitrary minting, burning, or decay-clock manipulation by untrusted callers.

**Mitigation**: `mintCard`, `burn`, `lockCard`, `unlockCard`, and `refreshCard` are gated by the `onlyManagerOrOwner` modifier. Only the contract owner and addresses explicitly authorised via `setManager` can call these.

### Input Validation

**Risk**: Invalid rarity or stat values leading to broken cards or contract state.

**Mitigation**:
- `rarity` must be in range 1–4 (`require(rarity >= 1 && rarity <= 4)`)
- `attack` and `defense` must be > 0
- `generation` must be < `MAX_GENERATION` (5) for both inputs before combining
- `targetTokenId != fuelTokenId` checked in `repairCard`
- Fuel rarity enforced per repair tier (Rare→Common, Epic/Legendary→Rare)
- Cards must not be locked to participate in combine

### Generation Cap

**Risk**: Infinite compounding produces unbounded stat inflation.

**Mitigation**: `MAX_GENERATION = 5` enforced in `isValidCombination`. Cards at generation 5 cannot be used as combination inputs.

### Combination Cooldown

**Risk**: Spamming combinations to game pseudorandom rarity outcomes.

**Mitigation**: `COOLDOWN_BLOCKS = 100` (~20 minutes at 12 s/block) enforced per player address via the `applyCooldown` modifier.

### Pseudorandom Rarity

**Risk**: Validators can manipulate `block.timestamp` to influence rarity outcomes.

**Mitigation (partial)**: Rarity is seeded with `keccak256(block.timestamp, msg.sender, r1, r2)`. This is sufficient for low-value outcomes in the current stage, but **must be replaced with Chainlink VRF before high-stakes mainnet launch**.

### Supply Integrity

**Risk**: Supply counters drift from actual token existence.

**Mitigation**: `_supplyByRarity` and `_supplyByElement` are incremented on mint and decremented on burn atomically within the same transaction. `SupplyUpdated` events are emitted for off-chain monitoring and reconciliation.

### Decay Clock Manipulation

**Risk**: Block number used as decay clock can be queried at different rates across chains.

**Mitigation**: Decay is computed purely from `block.number` differences — there is no reliance on `block.timestamp` for decay. The 7,200-block interval is chosen to match Ethereum mainnet (~12 s/block). Deploying on chains with different block times requires adjusting this constant.

---

## Known Remaining Risks

| Risk | Severity | Status |
|---|---|---|
| Pseudorandom rarity (block.timestamp) | Medium | Needs Chainlink VRF |
| No emergency pause | Medium | Not implemented |
| No timelock on owner actions | Low | Not implemented |
| Centralised minting (owner/manager) | Low | Acceptable for current stage |
| External audit | High | Not completed |

---

## Testing Coverage

- Unit tests: `test/CardNFT.test.js`, `test/CombinationManager.test.js`
- Covers: minting, burning, combining, fusing, unfusing, repairing, locked-transfer prevention, access control, cooldown enforcement

---

## Code Standards

- Solidity `0.8.28` with `viaIR: true` and optimiser runs: 200
- EVM target: `cancun`
- OpenZeppelin `v5.x` (`ERC721`, `Ownable`, `ReentrancyGuard`, `Base64`)
- Hardhat + TypeChain for type-safe testing and deployment
- Gas reporting via `hardhat-gas-reporter`
