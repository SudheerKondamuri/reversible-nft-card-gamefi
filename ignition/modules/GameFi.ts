import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CombinationManagerModule from "./CombinationManager";

export default buildModule("GameFiModule", (m) => {
  const { cardNFT, combinationManager } = m.useModule(CombinationManagerModule);

  const deployer = m.getAccount(0);
  console.log("Deployer address:", deployer);

  // Authorize CombinationManager to mint/burn in CardNFT
  const authorizeManager = m.call(cardNFT, "setManager", [combinationManager, true], {
    id: "authorizeManager",
  });

  // Set base image URI (images resolve as: baseImageURI + cardName + ".png")
  // Update this to your actual IPFS folder CID after uploading card images
  m.call(cardNFT, "setBaseImageURI", ["ipfs://PLACEHOLDER_CID/"], {
    id: "setBaseImageURI",
    after: [authorizeManager],
  });

  // ===================================================================
  // Base Card Minting (only cards with artwork)
  // Mint enough copies to demo all 5 fusion combinations:
  //   Fire + Fire   → Inferno Champion
  //   Fire + Earth  → Lava Titan
  //   Fire + Water  → Steam Golem
  //   Air  + Water  → Frost Sentinel
  //   Lightning + Water → Storm Herald
  // ===================================================================

  // --- Flame Spark x3 (needed for: Inferno Champion, Lava Titan, Steam Golem) ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark1",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark2",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark3",
    after: [authorizeManager],
  });

  // --- Ocean Guardian x3 (needed for: Steam Golem, Frost Sentinel, Storm Herald) ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian1",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian2",
    after: [authorizeManager],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian3",
    after: [authorizeManager],
  });

  // --- Stone Pebble x1 (needed for: Lava Titan) ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Stone Pebble", 1, "Earth", 2, 5, "Sturdy", 0], {
    id: "mintStonePebble",
    after: [authorizeManager],
  });

  // --- Breeze Wisp x1 (needed for: Frost Sentinel) ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Breeze Wisp", 1, "Air", 4, 2, "Evasive", 0], {
    id: "mintBreezeWisp",
    after: [authorizeManager],
  });

  // --- Thunder Strike x1 (needed for: Storm Herald) ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Thunder Strike", 2, "Lightning", 10, 4, "Shock", 0], {
    id: "mintThunderStrike",
    after: [authorizeManager],
  });

  return { cardNFT, combinationManager };
});
