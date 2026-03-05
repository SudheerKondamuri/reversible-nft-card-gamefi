import CardNFTArtifact from './abi/CardNFT.json';
import CombinationManagerArtifact from './abi/CombinationManager.json';

// Ensure NEXT_PUBLIC_ variables are set or fallback to empty addresses during dev
export const CARD_NFT_ADDRESS = (process.env.NEXT_PUBLIC_CARD_NFT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const COMBINATION_MANAGER_ADDRESS = (process.env.NEXT_PUBLIC_COMBINATION_MANAGER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CARD_NFT_ABI = CardNFTArtifact.abi;
export const COMBINATION_MANAGER_ABI = CombinationManagerArtifact.abi;
