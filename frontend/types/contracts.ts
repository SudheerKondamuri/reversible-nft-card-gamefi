// ──────────────────────────────────────────────
// TypeScript types for the NFT Card Game
// ──────────────────────────────────────────────

export interface Card {
    tokenId: bigint;
    name: string;
    rarity: number;
    element: string;
    attack: number;
    defense: number;
    ability: string;
    generation: number;
    isLocked: boolean;
    isFused: boolean;
    imageURI?: string;
    lastUpdatedBlock?: bigint;
}

export interface FusedData {
    tokenId1: bigint;
    tokenId2: bigint;
    isActive: boolean;
}

export interface CombinationPreview {
    element: string;
    attack: number;
    defense: number;
    rarity: number;
    ability: string;
    generation: number;
    name: string;
}

export type Rarity = 1 | 2 | 3 | 4;

export const RARITY_NAMES: Record<number, string> = {
    1: 'Common',
    2: 'Rare',
    3: 'Epic',
    4: 'Legendary',
};

export const RARITY_COLORS: Record<number, string> = {
    1: 'rarity-common',
    2: 'rarity-rare',
    3: 'rarity-epic',
    4: 'rarity-legendary',
};

export const ELEMENTS = [
    'Fire', 'Water', 'Earth', 'Air', 'Lightning',
    'Steam', 'Lava', 'Nature', 'Ice', 'Dust',
    'Plasma', 'Storm', 'Magnetism', 'Thunder',
] as const;

export type Element = typeof ELEMENTS[number];

export const ELEMENT_COLORS: Record<string, string> = {
    Fire: '#ef4444',
    Water: '#3b82f6',
    Earth: '#84cc16',
    Air: '#06b6d4',
    Lightning: '#eab308',
    Steam: '#94a3b8',
    Lava: '#f97316',
    Nature: '#22c55e',
    Ice: '#67e8f9',
    Dust: '#d4a574',
    Plasma: '#e879f9',
    Storm: '#6366f1',
    Magnetism: '#a78bfa',
    Thunder: '#fbbf24',
};

export const ELEMENT_ICONS: Record<string, string> = {
    Fire: '🔥',
    Water: '💧',
    Earth: '🌍',
    Air: '💨',
    Lightning: '⚡',
    Steam: '♨️',
    Lava: '🌋',
    Nature: '🌿',
    Ice: '❄️',
    Dust: '🌪️',
    Plasma: '🔮',
    Storm: '🌩️',
    Magnetism: '🧲',
    Thunder: '🔊',
};

export type SortOption = 'attack' | 'defense' | 'rarity' | 'tokenId';

export interface CardFilters {
    elements: string[];
    rarities: number[];
    generationMin: number;
    generationMax: number;
    searchQuery: string;
    sortBy: SortOption;
    sortDirection: 'asc' | 'desc';
}

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

export type CombinationMode = 'burn-and-mint' | 'fuse';

export interface ContractEvent {
    eventName: string;
    args: Record<string, unknown>;
    blockNumber: bigint;
    transactionHash: string;
}
