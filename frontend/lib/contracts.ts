import { type Address } from 'viem';

// ──────────────────────────────────────────────
// Contract ABIs — extracted from Hardhat artifacts
// ──────────────────────────────────────────────

export const CARD_NFT_ABI = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    // Events
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: false, internalType: 'string', name: 'name', type: 'string' }, { indexed: false, internalType: 'uint8', name: 'rarity', type: 'uint8' }, { indexed: false, internalType: 'string', name: 'element', type: 'string' }], name: 'CardMinted', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'CardBurned', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint8', name: 'rarity', type: 'uint8' }, { indexed: false, internalType: 'uint256', name: 'newSupply', type: 'uint256' }], name: 'SupplyUpdated', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }, { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'Transfer', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' }, { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' },
    // Read functions
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'getCardAttributes', outputs: [{ internalType: 'string', name: 'name', type: 'string' }, { internalType: 'uint8', name: 'rarity', type: 'uint8' }, { internalType: 'string', name: 'element', type: 'string' }, { internalType: 'uint16', name: 'attack', type: 'uint16' }, { internalType: 'uint16', name: 'defense', type: 'uint16' }, { internalType: 'string', name: 'ability', type: 'string' }, { internalType: 'uint8', name: 'generation', type: 'uint8' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint8', name: 'rarity', type: 'uint8' }], name: 'getTotalSupplyByRarity', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'string', name: 'element', type: 'string' }], name: 'getTotalSupplyByElement', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'totalMinted', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'isLocked', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'isManager', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'tokenURI', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'getBaseImageURI', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    // Write functions
    { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'string', name: 'name', type: 'string' }, { internalType: 'uint8', name: 'rarity', type: 'uint8' }, { internalType: 'string', name: 'element', type: 'string' }, { internalType: 'uint16', name: 'attack', type: 'uint16' }, { internalType: 'uint16', name: 'defense', type: 'uint16' }, { internalType: 'string', name: 'ability', type: 'string' }], name: 'mintCard', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'string', name: 'name', type: 'string' }, { internalType: 'uint8', name: 'rarity', type: 'uint8' }, { internalType: 'string', name: 'element', type: 'string' }, { internalType: 'uint16', name: 'attack', type: 'uint16' }, { internalType: 'uint16', name: 'defense', type: 'uint16' }, { internalType: 'string', name: 'ability', type: 'string' }, { internalType: 'uint8', name: 'generation', type: 'uint8' }], name: 'mintCardWithGen', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'burn', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'lockCard', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'unlockCard', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'refreshCard', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'manager', type: 'address' }, { internalType: 'bool', name: 'status', type: 'bool' }], name: 'setManager', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'string', name: 'baseImageURI', type: 'string' }], name: 'setBaseImageURI', outputs: [], stateMutability: 'nonpayable', type: 'function' },
] as const;

export const COMBINATION_MANAGER_ABI = [
    { inputs: [{ internalType: 'address', name: '_cardNFT', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
    // Events
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'newTokenId', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId2', type: 'uint256' }, { indexed: false, internalType: 'address', name: 'owner', type: 'address' }, { indexed: false, internalType: 'string', name: 'resultElement', type: 'string' }, { indexed: false, internalType: 'uint8', name: 'resultRarity', type: 'uint8' }], name: 'CardsCombined', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'fusedTokenId', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId2', type: 'uint256' }, { indexed: false, internalType: 'address', name: 'owner', type: 'address' }], name: 'CardsFused', type: 'event' },
    { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'fusedTokenId', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { indexed: true, internalType: 'uint256', name: 'tokenId2', type: 'uint256' }, { indexed: false, internalType: 'address', name: 'owner', type: 'address' }], name: 'CardUnfused', type: 'event' },
    // Read functions
    { inputs: [], name: 'MAX_GENERATION', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'COOLDOWN_BLOCKS', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'lastCombinationBlock', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'playerCombinationCount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'fusedCards', outputs: [{ internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }, { internalType: 'bool', name: 'isActive', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }], name: 'getCombinationPreview', outputs: [{ internalType: 'string', name: 'element', type: 'string' }, { internalType: 'uint16', name: 'attack', type: 'uint16' }, { internalType: 'uint16', name: 'defense', type: 'uint16' }, { internalType: 'uint8', name: 'rarity', type: 'uint8' }, { internalType: 'string', name: 'ability', type: 'string' }, { internalType: 'uint8', name: 'generation', type: 'uint8' }, { internalType: 'string', name: 'name', type: 'string' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }], name: 'isValidCombination', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'player', type: 'address' }], name: 'getPlayerCombinationCount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'cardNFT', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
    // Write functions
    { inputs: [{ internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }, { internalType: 'uint256[]', name: 'fuelCards', type: 'uint256[]' }], name: 'combineCards', outputs: [{ internalType: 'uint256', name: 'newTokenId', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId1', type: 'uint256' }, { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }], name: 'fuseCards', outputs: [{ internalType: 'uint256', name: 'fusedTokenId', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'fusedTokenId', type: 'uint256' }], name: 'unfuseCard', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'targetTokenId', type: 'uint256' }, { internalType: 'uint256', name: 'fuelTokenId', type: 'uint256' }], name: 'repairCard', outputs: [], stateMutability: 'nonpayable', type: 'function' },
] as const;

// ──────────────────────────────────────────────
// Contract addresses by chain ID
// ──────────────────────────────────────────────

export const CONTRACT_ADDRESSES: Record<number, { cardNFT: Address; combinationManager: Address }> = {
    // Hardhat local
    31337: {
        cardNFT: (process.env.NEXT_PUBLIC_CARD_NFT_ADDRESS as Address) || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        combinationManager: (process.env.NEXT_PUBLIC_COMBINATION_MANAGER_ADDRESS as Address) || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    },
    // Sepolia testnet
    11155111: {
        cardNFT: (process.env.NEXT_PUBLIC_SEPOLIA_CARD_NFT_ADDRESS as Address) || '0x0000000000000000000000000000000000000000',
        combinationManager: (process.env.NEXT_PUBLIC_SEPOLIA_COMBINATION_MANAGER_ADDRESS as Address) || '0x0000000000000000000000000000000000000000',
    },
};

export function getContractAddresses(chainId: number) {
    return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[31337];
}
