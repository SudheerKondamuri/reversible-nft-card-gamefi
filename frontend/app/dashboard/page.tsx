'use client';

import { useAccount } from 'wagmi';
import { AppShell } from '@/components/layout/AppShell';
import { CardGrid } from '@/components/cards/CardGrid';
import { usePlayerCards } from '@/hooks/usePlayerCards';
import { usePlayerCombinationCount } from '@/hooks/useCombinationContract';
import { useGameStore } from '@/store/gameStore';
import { RARITY_NAMES, ELEMENT_ICONS, ELEMENTS, type Card } from '@/types/contracts';
import { Search, SlidersHorizontal, X, TrendingUp, Layers, Swords, Crown } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

const RARITY_CHART_COLORS = ['#9ca3af', '#3b82f6', '#a855f7', '#f59e0b'];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export default function DashboardPage() {
    const { address } = useAccount();
    const { cards, isLoading, refetch } = usePlayerCards();
    const { data: comboCount } = usePlayerCombinationCount(address);

    const {
        filterElements, filterRarities, filterGenMin, filterGenMax,
        searchQuery, sortBy, sortDirection, currentPage,
        toggleElement, toggleRarity, setSearchQuery,
        setSortBy, toggleSortDirection, setCurrentPage, resetFilters,
    } = useGameStore();

    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 300);

    useEffect(() => {
        setSearchQuery(debouncedSearch);
    }, [debouncedSearch, setSearchQuery]);

    // Filter & sort cards
    const filteredCards = useMemo(() => {
        let result = [...cards];

        if (filterElements.length > 0) {
            result = result.filter((c) => filterElements.includes(c.element));
        }
        if (filterRarities.length > 0) {
            result = result.filter((c) => filterRarities.includes(c.rarity));
        }
        result = result.filter((c) => c.generation >= filterGenMin && c.generation <= filterGenMax);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((c) => c.name.toLowerCase().includes(q));
        }

        result.sort((a, b) => {
            let cmp = 0;
            switch (sortBy) {
                case 'attack': cmp = a.attack - b.attack; break;
                case 'defense': cmp = a.defense - b.defense; break;
                case 'rarity': cmp = a.rarity - b.rarity; break;
                case 'tokenId': cmp = Number(a.tokenId - b.tokenId); break;
            }
            return sortDirection === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [cards, filterElements, filterRarities, filterGenMin, filterGenMax, searchQuery, sortBy, sortDirection]);

    // Stats
    const stats = useMemo(() => {
        const rarityBreakdown = [1, 2, 3, 4].map((r) => ({
            name: RARITY_NAMES[r],
            value: cards.filter((c) => c.rarity === r).length,
        }));
        const elementBreakdown: Record<string, number> = {};
        cards.forEach((c) => {
            elementBreakdown[c.element] = (elementBreakdown[c.element] || 0) + 1;
        });
        const highestGen = cards.reduce((max, c) => Math.max(max, c.generation), 0);
        return { rarityBreakdown, elementBreakdown, highestGen };
    }, [cards]);

    const hasActiveFilters = filterElements.length > 0 || filterRarities.length > 0 || searchQuery;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-white">Your Collection</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {cards.length} cards • {filteredCards.length} shown
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="glass glass-hover rounded-xl px-4 py-2 text-sm text-slate-300 transition-all hover:text-white"
                    >
                        Refresh
                    </button>
                </div>

                {/* Stats panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10">
                                <Layers className="h-4 w-4 text-accent-glow" />
                            </div>
                            <span className="text-sm text-slate-400">Total Cards</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{cards.length}</p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                                <Swords className="h-4 w-4 text-purple-400" />
                            </div>
                            <span className="text-sm text-slate-400">Combinations</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{comboCount?.toString() || '0'}</p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                                <Crown className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="text-sm text-slate-400">Highest Gen</span>
                        </div>
                        <p className="text-2xl font-bold text-white">Gen {stats.highestGen}</p>
                    </div>

                    {/* Rarity chart */}
                    <div className="glass rounded-2xl p-5 col-span-1 md:col-span-2">
                        <span className="text-sm text-slate-400 mb-2 block">Rarity Breakdown</span>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.rarityBreakdown.filter((d) => d.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={20}
                                            outerRadius={38}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {stats.rarityBreakdown.map((_, i) => (
                                                <Cell key={i} fill={RARITY_CHART_COLORS[i]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e2033',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-1">
                                {stats.rarityBreakdown.map((item, i) => (
                                    <div key={item.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RARITY_CHART_COLORS[i] }} />
                                            <span className="text-slate-400">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Element breakdown */}
                {Object.keys(stats.elementBreakdown).length > 0 && (
                    <div className="glass rounded-2xl p-5">
                        <span className="text-sm text-slate-400 mb-3 block">Elements in Collection</span>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(stats.elementBreakdown).map(([el, count]) => (
                                <div key={el} className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                                    <span>{ELEMENT_ICONS[el] || '✨'}</span>
                                    <span className="text-sm font-medium text-white">{el}</span>
                                    <span className="text-xs text-slate-500">×{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="glass rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Filters & Sort</span>
                        </div>
                        {hasActiveFilters && (
                            <button onClick={resetFilters} className="text-xs text-accent-glow hover:underline flex items-center gap-1">
                                <X className="h-3 w-3" /> Clear all
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search cards by name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-xl bg-dark-800 border border-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/30 focus:ring-1 focus:ring-accent-primary/20 transition-all"
                        />
                    </div>

                    {/* Element filters */}
                    <div>
                        <span className="text-xs text-slate-500 mb-2 block">Element</span>
                        <div className="flex flex-wrap gap-1.5">
                            {ELEMENTS.slice(0, 5).map((el) => (
                                <button
                                    key={el}
                                    onClick={() => toggleElement(el)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filterElements.includes(el)
                                            ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                                            : 'bg-dark-800 text-slate-400 border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <span>{ELEMENT_ICONS[el]}</span>
                                    {el}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rarity filters */}
                    <div>
                        <span className="text-xs text-slate-500 mb-2 block">Rarity</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[1, 2, 3, 4].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => toggleRarity(r)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filterRarities.includes(r)
                                            ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                                            : 'bg-dark-800 text-slate-400 border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {RARITY_NAMES[r]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Sort by</span>
                        {(['tokenId', 'attack', 'defense', 'rarity'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSortBy(s)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${sortBy === s
                                        ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                                        : 'bg-dark-800 text-slate-400 border border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {s === 'tokenId' ? 'Mint Date' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                        <button
                            onClick={toggleSortDirection}
                            className="glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-all"
                        >
                            {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                        </button>
                    </div>
                </div>

                {/* Card grid */}
                <CardGrid
                    cards={filteredCards}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    pageSize={24}
                />
            </div>
        </AppShell>
    );
}
