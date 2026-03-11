import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CombinationManagerModule from "./CombinationManager";
import "dotenv/config";

const BASE_IMAGE = process.env.BASE_IMAGE_URI || "ipfs://PLACEHOLDER_CID/cards/";

export default buildModule("GameFiModule", (m) => {
  const { cardNFT, combinationManager } = m.useModule(CombinationManagerModule);

  const deployer = m.getAccount(0);
  // Remove console.log - side effects are not safe in module builders

  // Authorize CombinationManager to mint/burn in CardNFT
  const authorizeManager = m.call(cardNFT, "setManager", [combinationManager, true], {
    id: "authorizeManager",
  });

  // Set base image URI
  const setBaseImage = m.call(cardNFT, "setBaseImageURI", [BASE_IMAGE], {
    id: "setBaseImageURI",
    after: [authorizeManager],
  });

  // --- Flame Spark x3 ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark1",
    after: [setBaseImage],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark2",
    after: [setBaseImage],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Flame Spark", 1, "Fire", 3, 2, "Ignite", 0], {
    id: "mintFlameSpark3",
    after: [setBaseImage],
  });

  // --- Ocean Guardian x3 ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian1",
    after: [setBaseImage],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian2",
    after: [setBaseImage],
  });
  m.call(cardNFT, "mintCardWithGen", [deployer, "Ocean Guardian", 2, "Water", 6, 9, "Barrier", 0], {
    id: "mintOceanGuardian3",
    after: [setBaseImage],
  });

  // --- Stone Pebble x1 ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Stone Pebble", 1, "Earth", 2, 5, "Sturdy", 0], {
    id: "mintStonePebble",
    after: [setBaseImage],
  });

  // --- Breeze Wisp x1 ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Breeze Wisp", 1, "Air", 4, 2, "Evasive", 0], {
    id: "mintBreezeWisp",
    after: [setBaseImage],
  });

  // --- Thunder Strike x1 ---
  m.call(cardNFT, "mintCardWithGen", [deployer, "Thunder Strike", 2, "Lightning", 10, 4, "Shock", 0], {
    id: "mintThunderStrike",
    after: [setBaseImage],
  });

  return { cardNFT, combinationManager };
});