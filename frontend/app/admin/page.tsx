'use client';

import { useAccount } from 'wagmi';
import { AppShell } from '@/components/layout/AppShell';
import { useContractOwner, useMintCard, useTotalSupplyByRarity, useTotalMinted } from '@/hooks/useCardContract';
import { useContractEvents } from '@/hooks/useContractEvents';
import { RARITY_NAMES, ELEMENTS } from '@/types/contracts';
import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldX, Plus, Loader2, CheckCircle, History, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
    const { address } = useAccount();
    const { data: contractOwner, isLoading: ownerLoading } = useContractOwner();
    const { data: totalMinted } = useTotalMinted();
    const { data: commonSupply } = useTotalSupplyByRarity(1);
    const { data: rareSupply } = useTotalSupplyByRarity(2);
    const { data: epicSupply } = useTotalSupplyByRarity(3);
    const { data: legendarySupply } = useTotalSupplyByRarity(4);

    const { mint, status, isPending, isConfirming, isSuccess, error } = useMintCard();
    const { events, isLoading: eventsLoading, fetchAllEvents } = useContractEvents();

    // Form state
    const [form, setForm] = useState({
        to: '',
        name: '',
        rarity: 1,
        element: 'Fire',
        attack: 5,
        defense: 5,
        ability: '',
    });

    const [batchCount, setBatchCount] = useState(1);

    const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

    useEffect(() => {
        if (isOwner) fetchAllEvents();
    }, [isOwner, fetchAllEvents]);

    const handleMint = async () => {
        const to = (form.to || address) as `0x${string}`;
        for (let i = 0; i < batchCount; i++) {
            await mint(to, form.name, form.rarity, form.element, form.attack, form.defense, form.ability);
        }
    };

    // Access denied
    if (ownerLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 text-accent-glow animate-spin" />
                </div>
            </AppShell>
        );
    }

    if (!isOwner) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="glass rounded-2xl p-10">
                        <ShieldX className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h1 className="font-display text-2xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-sm text-slate-400 max-w-md">
                            This page is restricted to the contract owner. Your connected wallet does not have admin privileges.
                        </p>
                        {contractOwner && (
                            <p className="text-xs text-slate-500 mt-4 font-mono">
                                Owner: {contractOwner.slice(0, 6)}...{contractOwner.slice(-4)}
                            </p>
                        )}
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-green-400" />
                    <div>
                        <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Contract owner controls and monitoring.</p>
                    </div>
                </div>

                {/* Supply overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="glass rounded-2xl p-4 text-center">
                        <p className="text-xs text-slate-400 mb-1">Total Minted</p>
                        <p className="text-2xl font-bold text-white">{totalMinted?.toString() || '0'}</p>
                    </div>
                    {[
                        { name: 'Common', supply: commonSupply, color: 'text-gray-400' },
                        { name: 'Rare', supply: rareSupply, color: 'text-blue-400' },
                        { name: 'Epic', supply: epicSupply, color: 'text-purple-400' },
                        { name: 'Legendary', supply: legendarySupply, color: 'text-amber-400' },
                    ].map((r) => (
                        <div key={r.name} className="glass rounded-2xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">{r.name}</p>
                            <p className={`text-2xl font-bold ${r.color}`}>{r.supply?.toString() || '0'}</p>
                        </div>
                    ))}
                </div>

                {/* Mint form */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-accent-glow" /> Batch Mint Cards
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Recipient Address</label>
                            <input
                                type="text"
                                placeholder={address || '0x...'}
                                value={form.to}
                                onChange={(e) => setForm({ ...form, to: e.target.value })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Card Name</label>
                            <input
                                type="text"
                                placeholder="Flame Spark"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Rarity</label>
                            <select
                                value={form.rarity}
                                onChange={(e) => setForm({ ...form, rarity: Number(e.target.value) })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all"
                            >
                                {[1, 2, 3, 4].map((r) => (
                                    <option key={r} value={r}>{RARITY_NAMES[r]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Element</label>
                            <select
                                value={form.element}
                                onChange={(e) => setForm({ ...form, element: e.target.value })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all"
                            >
                                {ELEMENTS.map((el) => (
                                    <option key={el} value={el}>{el}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Attack</label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={form.attack}
                                onChange={(e) => setForm({ ...form, attack: Number(e.target.value) })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Defense</label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={form.defense}
                                onChange={(e) => setForm({ ...form, defense: Number(e.target.value) })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Special Ability</label>
                            <input
                                type="text"
                                placeholder="Ignite"
                                value={form.ability}
                                onChange={(e) => setForm({ ...form, ability: e.target.value })}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Batch Count</label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={batchCount}
                                onChange={(e) => setBatchCount(Number(e.target.value))}
                                className="w-full rounded-xl bg-dark-800 border border-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-primary/30 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleMint}
                        disabled={isPending || isConfirming || !form.name}
                        className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-secondary hover:to-accent-primary text-white font-semibold rounded-xl py-3.5 transition-all disabled:opacity-40"
                    >
                        {isPending || isConfirming ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> {isPending ? 'Confirm in Wallet...' : 'Minting...'}</>
                        ) : (
                            <><Plus className="h-4 w-4" /> Mint {batchCount > 1 ? `${batchCount} Cards` : 'Card'}</>
                        )}
                    </button>

                    {isSuccess && (
                        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" /> Card(s) minted successfully!
                        </div>
                    )}

                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                            <AlertTriangle className="h-4 w-4" /> {error.message}
                        </div>
                    )}
                </div>

                {/* Event logs */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 text-slate-400" /> Contract Event Logs
                    </h2>

                    {eventsLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-10 rounded-lg skeleton" />
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <p className="text-sm text-slate-500">No events found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                                        <th className="pb-3 pr-4">Event</th>
                                        <th className="pb-3 pr-4">Block</th>
                                        <th className="pb-3 pr-4">Details</th>
                                        <th className="pb-3">Tx Hash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.slice(0, 50).map((event, i) => (
                                        <tr key={i} className="border-b border-white/3 hover:bg-white/2">
                                            <td className="py-2.5 pr-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${event.eventName === 'CardMinted' ? 'bg-green-500/10 text-green-400' :
                                                        event.eventName === 'CardBurned' ? 'bg-red-500/10 text-red-400' :
                                                            event.eventName === 'CardsCombined' ? 'bg-orange-500/10 text-orange-400' :
                                                                event.eventName === 'CardsFused' ? 'bg-purple-500/10 text-purple-400' :
                                                                    'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {event.eventName}
                                                </span>
                                            </td>
                                            <td className="py-2.5 pr-4 text-slate-400 font-mono text-xs">
                                                {event.blockNumber.toString()}
                                            </td>
                                            <td className="py-2.5 pr-4 text-slate-400 text-xs max-w-xs truncate">
                                                {Object.entries(event.args).map(([k, v]) => `${k}: ${String(v)}`).join(', ')}
                                            </td>
                                            <td className="py-2.5 text-slate-500 font-mono text-xs">
                                                {event.transactionHash.slice(0, 10)}...
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
