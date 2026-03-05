import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CombinationManagerModule from "./CombinationManager";

export default buildModule("GameFiModule", (m) => {
  const { cardNFT, combinationManager } = m.useModule(CombinationManagerModule);

  const deployer = m.getAccount(0);

  // Authorize CombinationManager to mint/burn in CardNFT
  const authorizeManager = m.call(cardNFT, "setManager", [combinationManager, true], {
    id: "authorizeManager",
  });

  // Set up the baseuri for CardNFT (Placeholder URI, can be updated later to point to actual metadata)
    m.call(cardNFT, "setBaseURI", ["https://gamefi.example/api/cards/"], {
        id: "setBaseURI",
        after: [authorizeManager],
    });

  // --- Fire Set ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ember Spirit", 1, "Fire", 4, 3, "Burn", 0], {
    id: "mintEmberSpirit",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Blazing Knight", 2, "Fire", 7, 6, "Shield Breaker", 0], {
    id: "mintBlazingKnight",
    after: [authorizeManager],
  });

  // --- Water Set ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Water Droplet", 1, "Water", 2, 4, "Defensive", 0], {
    id: "mintWaterDroplet",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Tide Caller", 1, "Water", 3, 5, "Wave", 0], {
    id: "mintTideCaller",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian",
    after: [authorizeManager],
  });

  // --- Earth Set ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Stone Pebble", 1, "Earth", 2, 5, "Sturdy", 0], {
    id: "mintStonePebble",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Root Tender", 1, "Earth", 3, 4, "Growth", 0], {
    id: "mintRootTender",
    after: [authorizeManager],
  });

  // --- Air Set ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Breeze Wisp", 1, "Air", 4, 2, "Evasive", 0], {
    id: "mintBreezeWisp",
    after: [authorizeManager],
  });

  // --- Lightning Set ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Thunder Strike", 2, "Lightning", 10, 4, "Shock", 0], {
    id: "mintThunderStrike",
    after: [authorizeManager],
  });

  return { cardNFT, combinationManager };
});
