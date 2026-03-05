import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CardNFTModule", (m) => {
  const cardNFT = m.contract("CardNFT");

  return { cardNFT };
});
