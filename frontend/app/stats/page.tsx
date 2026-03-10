'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useTotalSupplyByRarity, useTotalSupplyByElement, useTotalMinted } from '@/hooks/useCardContract';
import { useContractEvents } from '@/hooks/useContractEvents';
import { RARITY_NAMES, ELEMENTS, ELEMENT_COLORS, ELEMENT_ICONS } from '@/types/contracts';
import { useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Layers, Flame, Link2, Users, Crown } from 'lucide-react';

const RARITY_COLORS = ['#9ca3af', '#3b82f6', '#a855f7', '#f59e0b'];

export default function StatsPage() {
    const { data: totalMinted } = useTotalMinted();
    const { data: commonSupply } = useTotalSupplyByRarity(1);
    const { data: rareSupply } = useTotalSupplyByRarity(2);
    const { data: epicSupply } = useTotalSupplyByRarity(3);
    const { data: legendarySupply } = useTotalSupplyByRarity(4);

    const { data: fireSupply } = useTotalSupplyByElement('Fire');
    const { data: waterSupply } = useTotalSupplyByElement('Water');
    const { data: earthSupply } = useTotalSupplyByElement('Earth');
    const { data: airSupply } = useTotalSupplyByElement('Air');
    const { data: lightningSupply } = useTotalSupplyByElement('Lightning');

    const { events, isLoading: eventsLoading, fetchAllEvents, fetchCombinationEvents } = useContractEvents();

    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents]);

    const rarityData = useMemo(() => [
        { name: 'Common', count: Number(commonSupply ?? 0n), fill: RARITY_COLORS[0] },
        { name: 'Rare', count: Number(rareSupply ?? 0n), fill: RARITY_COLORS[1] },
        { name: 'Epic', count: Number(epicSupply ?? 0n), fill: RARITY_COLORS[2] },
        { name: 'Legendary', count: Number(legendarySupply ?? 0n), fill: RARITY_COLORS[3] },
    ], [commonSupply, rareSupply, epicSupply, legendarySupply]);

    const elementData = useMemo(() => {
        const elements = [
            { name: 'Fire', count: Number(fireSupply ?? 0n), color: ELEMENT_COLORS.Fire },
            { name: 'Water', count: Number(waterSupply ?? 0n), color: ELEMENT_COLORS.Water },
            { name: 'Earth', count: Number(earthSupply ?? 0n), color: ELEMENT_COLORS.Earth },
            { name: 'Air', count: Number(airSupply ?? 0n), color: ELEMENT_COLORS.Air },
            { name: 'Lightning', count: Number(lightningSupply ?? 0n), color: ELEMENT_COLORS.Lightning },
        ];
        return elements.filter((e) => e.count > 0);
    }, [fireSupply, waterSupply, earthSupply, airSupply, lightningSupply]);

    const combinationStats = useMemo(() => {
        const burnMints = events.filter((e) => e.eventName === 'CardsCombined').length;
        const fuses = events.filter((e) => e.eventName === 'CardsFused').length;
        const unfuses = events.filter((e) => e.eventName === 'CardUnfused').length;
        const totalCombinations = burnMints + fuses;

        // Leaderboard by player combo count
        const playerCounts: Record<string, number> = {};
        events.filter((e) => ['CardsCombined', 'CardsFused'].includes(e.eventName)).forEach((e) => {
            const owner = (e.args.owner as string) || 'unknown';
            playerCounts[owner] = (playerCounts[owner] || 0) + 1;
        });
        const leaderboard = Object.entries(playerCounts)
            .map(([addr, count]) => ({ address: addr, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return { burnMints, fuses, unfuses, totalCombinations, leaderboard };
    }, [events]);

    const tooltipStyle = {
        contentStyle: {
            backgroundColor: '#1e2033',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#f1f5f9',
        },
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white">Game Statistics</h1>
                    <p className="text-sm text-slate-400 mt-1">Real-time economic data from the blockchain.</p>
                </div>

                {/* Top stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10">
                                <Layers className="h-4 w-4 text-accent-glow" />
                            </div>
                            <span className="text-xs text-slate-400">Total Minted</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{totalMinted?.toString() || '0'}</p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                                <TrendingUp className="h-4 w-4 text-purple-400" />
                            </div>
                            <span className="text-xs text-slate-400">Combinations</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{combinationStats.totalCombinations}</p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                                <Flame className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-xs text-slate-400">Burn & Mint</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{combinationStats.burnMints}</p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                                <Link2 className="h-4 w-4 text-green-400" />
                            </div>
                            <span className="text-xs text-slate-400">Fusions</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{combinationStats.fuses}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rarity bar chart */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold text-white mb-4">Supply by Rarity</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={rarityData} barCategoryGap="20%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip {...tooltipStyle} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {rarityData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Element pie chart */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-bold text-white mb-4">Supply by Element</h2>
                        <div className="h-64 flex items-center">
                            <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={elementData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="count"
                                            strokeWidth={0}
                                        >
                                            {elementData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...tooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-2">
                                {elementData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-300">{ELEMENT_ICONS[item.name]} {item.name}</span>
                                        </div>
                                        <span className="font-bold text-white">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Crown className="h-5 w-5 text-amber-400" />
                        <h2 className="font-display text-lg font-bold text-white">Top Combinators</h2>
                    </div>
                    {combinationStats.leaderboard.length === 0 ? (
                        <p className="text-sm text-slate-500">No combinations yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {combinationStats.leaderboard.map((entry, i) => (
                                <div key={entry.address} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-lg font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-500'}`}>
                                            #{i + 1}
                                        </span>
                                        <span className="text-sm text-white font-mono">
                                            {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-accent-glow">{entry.count} combos</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
