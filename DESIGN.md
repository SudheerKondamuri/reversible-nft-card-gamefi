# Game Design & Economics

## Smart Contract Architecture
The GameFi application's architecture is divided into two primary contracts to separate state and logic cleanly and securely:
1. **`CardNFT.sol`**: An ERC721 token that strictly maintains state and ownership. It holds the structural data of the cards including rarity, element, stats, abilities, and generation markers.
2. **`CombinationManager.sol`**: A stateless business logic core that governs all rulesets and economic mechanisms. It alone possesses authorization to interact with and mint/burn states on `CardNFT.sol`.

## Mechanisms Evaluated

### Traditional Burn-and-Mint (`combineCards`)
**Pros:** 
- Deflationary logic constantly burns circulating supply, keeping cards scarce.
- Guarantees completely fresh metadata since the old assets are physically eradicated from the blockchain state.

**Cons:** 
- Expensive gas loops initially due to deleting storage vectors permanently causing blockchain bloating.
- Irreversible for the end user if the new generation card is not statistically superior or desired.

### Reversible Fusion (`fuseCards` / `unfuseCard`)
**Pros:** 
- Highly player-friendly mechanism allowing users to experiment with various combination matrices without permanent risk to their high-rarity assets.
- Creates an inherent "staking" ecosystem where powerful base-level cards serve as underlying collateral for advanced Gen 1+ cards.

**Cons:** 
- Potentially inflates visual supply if locked cards are accounted for in macroeconomic charts.
- Slightly higher gas overhead when initially locking the cards due to tracking mapping updates (`fusedCards`), although it significantly lowers gas impact upon un-fusing/restoring states.

## Anti-Hoarding Economics
To limit wealthy players from automatically buying cheap Common cards directly on the marketplace to chain-combine to Legendary statuses without effort, two constraints are natively enforced:

1. **Progressive Fuel Costs:** Higher rarity fusions linearly require more "Common" tier cards to be burned as fuel to legitimize the fusion. By enforcing this demand vector, Common cards maintain intrinsic marketplace value even for top-tier players.
2. **Generational Deterioration:** Combined cards strictly calculate a "Generation" tracker up to a maximum cap (Gen 5). As cards move deeper into combinations, base structural penalties are increasingly applied to Attack and Defense logic, soft-capping power creep.
3. **Block-Based Cooldowns:** The system mandates a 100-block localized cooldown strictly assigned to `msg.sender` to delay programmatic bots from spamming network transactions during high-volatility events.
