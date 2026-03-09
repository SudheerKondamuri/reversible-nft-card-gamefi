import { create } from 'zustand';
import { type CombinationMode, type SortOption } from '@/types/contracts';

interface GameState {
    // Combination state
    selectedCard1: bigint | null;
    selectedCard2: bigint | null;
    combinationMode: CombinationMode;
    fuelCards: bigint[];

    // Filter state
    filterElements: string[];
    filterRarities: number[];
    filterGenMin: number;
    filterGenMax: number;
    searchQuery: string;
    sortBy: SortOption;
    sortDirection: 'asc' | 'desc';
    currentPage: number;

    // Actions — combination
    selectCard1: (tokenId: bigint | null) => void;
    selectCard2: (tokenId: bigint | null) => void;
    swapCards: () => void;
    clearSelection: () => void;
    setCombinationMode: (mode: CombinationMode) => void;
    addFuelCard: (tokenId: bigint) => void;
    removeFuelCard: (tokenId: bigint) => void;
    clearFuelCards: () => void;

    // Actions — filters
    toggleElement: (element: string) => void;
    toggleRarity: (rarity: number) => void;
    setGenRange: (min: number, max: number) => void;
    setSearchQuery: (q: string) => void;
    setSortBy: (sort: SortOption) => void;
    toggleSortDirection: () => void;
    setCurrentPage: (page: number) => void;
    resetFilters: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    selectedCard1: null,
    selectedCard2: null,
    combinationMode: 'fuse',
    fuelCards: [],

    filterElements: [],
    filterRarities: [],
    filterGenMin: 0,
    filterGenMax: 5,
    searchQuery: '',
    sortBy: 'tokenId',
    sortDirection: 'asc',
    currentPage: 1,

    selectCard1: (tokenId) => set({ selectedCard1: tokenId }),
    selectCard2: (tokenId) => set({ selectedCard2: tokenId }),
    swapCards: () => set((s) => ({ selectedCard1: s.selectedCard2, selectedCard2: s.selectedCard1 })),
    clearSelection: () => set({ selectedCard1: null, selectedCard2: null, fuelCards: [] }),
    setCombinationMode: (mode) => set({ combinationMode: mode }),
    addFuelCard: (tokenId) => set((s) => ({ fuelCards: [...s.fuelCards, tokenId] })),
    removeFuelCard: (tokenId) => set((s) => ({ fuelCards: s.fuelCards.filter((id) => id !== tokenId) })),
    clearFuelCards: () => set({ fuelCards: [] }),

    toggleElement: (element) =>
        set((s) => ({
            filterElements: s.filterElements.includes(element)
                ? s.filterElements.filter((e) => e !== element)
                : [...s.filterElements, element],
            currentPage: 1,
        })),
    toggleRarity: (rarity) =>
        set((s) => ({
            filterRarities: s.filterRarities.includes(rarity)
                ? s.filterRarities.filter((r) => r !== rarity)
                : [...s.filterRarities, rarity],
            currentPage: 1,
        })),
    setGenRange: (min, max) => set({ filterGenMin: min, filterGenMax: max, currentPage: 1 }),
    setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
    setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
    toggleSortDirection: () => set((s) => ({ sortDirection: s.sortDirection === 'asc' ? 'desc' : 'asc', currentPage: 1 })),
    setCurrentPage: (page) => set({ currentPage: page }),
    resetFilters: () =>
        set({
            filterElements: [],
            filterRarities: [],
            filterGenMin: 0,
            filterGenMax: 5,
            searchQuery: '',
            sortBy: 'tokenId',
            sortDirection: 'asc',
            currentPage: 1,
        }),
}));
