# Security Architecture & Mitigations

## 1. Reentrancy Protection
All state-modifying endpoints operating on multiple tokens (Combinations, Fusions, Unfusions) natively implement OpenZeppelin's `ReentrancyGuard` module and `nonReentrant` modifiers. Additionally, standard Checks-Effects-Interactions (CEI) design patterns are respected. For instance, in `combineCards()`, cards are formally burned, and internal mapping metrics like `playerCombinationCount` are firmly updated *before* the new asset is minted.

## 2. Authorization Boundaries
Access control mechanisms restrict critical structural workflows in `CardNFT.sol` to a specialized `onlyManagerOrOwner` modifier. 
Only the designated core logic contract (`CombinationManager.sol`) or the deployer wallet can alter `CardNFT.sol` supplies. This explicitly isolates the NFT state from public calls. End-users interact indirectly via `CombinationManager`.

## 3. Storage Manipulations & Locking Checks
The Reversible Fusion mechanism employs a custom `isLocked` tracking mapping in `CombinationManager`.
To prevent griefing or malicious state-desyncs, the `isValidCombination` safety barrier prevents users from combining cards that are natively locked inside a parallel Fusion. 

Additionally, because the `isLocked` verification functions independently across combinations and fusions, a player cannot theoretically fuse cards and then proceed to burn those exact locked components via standard market transfers or burn-and-mint mechanisms.

## 4. Pseudorandomness Considerations 
**Vulnerability Identified:** 
Currently, the prototype uses `block.timestamp` and `msg.sender` combined with native parameters inside `RarityLogic.sol` to perform a pseudo-random hash modulo outcome. This strategy is insecure in a mainnet Production ecosystem, as block validators/miners can manipulate block timestamps dynamically to orchestrate guaranteed Legendary rolls.

**Proposed Production Mitigation:**
We intentionally separated rarity logic into an isolated internal Library. Prior to deploying onto Ethereum Mainnet or high-value Layer 2s, `CombinationManager.sol` must be retrofitted to implement a standardized **Chainlink VRF (Verifiable Random Function)** matrix to govern off-chain cryptographic stochastic probability safely.

## 5. Gas Optimizations & Denial of Service (DoS)
- Storage updates are batched where structurally permissible.
- For Loops in fuel validation iterate exclusively across localized external Memory inputs dynamically bounded by strict tier thresholds (`< Maximum Rare Generation`), mitigating theoretical OOG (Out-Of-Gas) scenarios. 
