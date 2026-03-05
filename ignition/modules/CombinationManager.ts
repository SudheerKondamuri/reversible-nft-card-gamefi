import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CardNFTModule from "./CardNFT";

export default buildModule("CombinationManagerModule", (m) => {
  const { cardNFT } = m.useModule(CardNFTModule);

  const combinationManager = m.contract("CombinationManager", [cardNFT]);

  return { cardNFT, combinationManager };
});
