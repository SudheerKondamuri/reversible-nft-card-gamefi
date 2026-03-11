'use client';

import { useAccount, useBlockNumber } from 'wagmi';
import { AppShell } from '@/components/layout/AppShell';
import { CardDisplay } from '@/components/cards/CardDisplay';
import { usePlayerCards } from '@/hooks/usePlayerCards';
import { useRepairCard } from '@/hooks/useCombinationContract';
import { type Card, RARITY_NAMES, ELEMENT_ICONS, ELEMENT_COLORS } from '@/types/contracts';
import { useMemo, useState, useEffect } from 'react';
import { Wrench, Loader2, CheckCircle, AlertTriangle, ArrowRight, X, Clock, ShieldCheck, ShieldAlert, Flame } from 'lucide-react';
import { clsx } from 'clsx';

const BLOCKS_PER_DECAY = 7200n;
const SECONDS_PER_BLOCK = 12;

const RARITY_BADGE: Record<number, string> = {
    1: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    2: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    3: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    4: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

function requiredFuelRarity(targetRarity: number): number {
    if (targetRarity === 2) return 1;
    if (targetRarity === 3) return 2;
    if (targetRarity === 4) return 2;
    return 0;
}

function blocksToTime(blocks: bigint): string {
    const secs = Number(blocks) * SECONDS_PER_BLOCK;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

interface DecayInfo {
    blocksPassed: bigint;
    decayPoints: number;
    blocksIntoInterval: bigint;
    blocksUntilNext: bigint;
    intervalPct: number;
}

function getDecayInfo(card: Card, currentBlock: bigint): DecayInfo {
    if (card.lastUpdatedBlock === undefined || currentBlock <= card.lastUpdatedBlock) {
        return { blocksPassed: 0n, decayPoints: 0, blocksIntoInterval: 0n, blocksUntilNext: BLOCKS_PER_DECAY, intervalPct: 0 };
    }
    const blocksPassed = currentBlock - card.lastUpdatedBlock;
    const decayPoints = Number(blocksPassed / BLOCKS_PER_DECAY);
    const blocksIntoInterval = blocksPassed % BLOCKS_PER_DECAY;
    const blocksUntilNext = BLOCKS_PER_DECAY - blocksIntoInterval;
    const intervalPct = Math.min(Number(blocksIntoInterval) / Number(BLOCKS_PER_DECAY) * 100, 100);
    return { blocksPassed, decayPoints, blocksIntoInterval, blocksUntilNext, intervalPct };
}

function RepairTargetRow({ card, selected, onSelect, currentBlock }: {
    card: Card; selected: boolean; onSelect: () => void; currentBlock: bigint;
}) {
    const info = getDecayInfo(card, currentBlock);
    const needsRepair = info.decayPoints > 0;
    const urgency = info.intervalPct > 75;
    const elementColor = ELEMENT_COLORS[card.element] || '#6366f1';
    const elementIcon = ELEMENT_ICONS[card.element] || '✨';

    return (
        <button
            onClick={onSelect}
            className={clsx(
                'w-full text-left rounded-xl p-3 transition-all duration-200 border',
                selected
                    ? 'border-accent-primary/60 bg-accent-primary/10'
                    : needsRepair
                        ? 'border-red-500/25 bg-red-500/5 hover:bg-red-500/10'
                        : 'border-white/8 bg-white/3 hover:bg-white/6'
            )}
        >
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: `${elementColor}18`, border: `1px solid ${elementColor}30` }}
                >
                    {elementIcon}
                </div>

                {/* Name + rarity */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{card.name}</span>
                        <span className={clsx('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border shrink-0', RARITY_BADGE[card.rarity])}>
                            {RARITY_NAMES[card.rarity]}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-dark-900 overflow-hidden">
                            <div
                                className={clsx('h-full rounded-full transition-all', needsRepair ? 'bg-red-500' : urgency ? 'bg-amber-400' : 'bg-green-500')}
                                style={{ width: `${info.intervalPct}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 w-24 text-right">
                            {info.blocksPassed.toString()} / {(BLOCKS_PER_DECAY * BigInt(info.decayPoints + 1)).toString()} blk
                        </span>
                    </div>
                </div>

                {/* Status badge */}
                <div className="shrink-0 text-right space-y-1">
                    {needsRepair ? (
                        <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 rounded-lg px-2 py-1">
                            <ShieldAlert className="h-3 w-3 text-red-400" />
                            <span className="text-xs font-bold text-red-400">-{info.decayPoints} pts</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-lg px-2 py-1">
                            <ShieldCheck className="h-3 w-3 text-green-400" />
                            <span className="text-xs font-bold text-green-400">Full</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 justify-end">
                        <Clock className={clsx('h-3 w-3', urgency ? 'text-amber-400' : 'text-slate-600')} />
                        <span className={clsx('text-[10px]', urgency ? 'text-amber-400' : 'text-slate-500')}>
                            {blocksToTime(info.blocksUntilNext)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Warning line */}
            {(needsRepair || urgency) && (
                <p className={clsx('text-[10px] mt-2 pl-13', needsRepair ? 'text-red-400/80' : 'text-amber-400/80')}>
                    {needsRepair
                        ? `⚠ Stats reduced by ${info.decayPoints} pt${info.decayPoints !== 1 ? 's' : ''} — repair to restore full power`
                        : '⏳ Approaching next decay point — consider repairing soon'}
                </p>
            )}
        </button>
    );
}

export default function RepairPage() {
    const { address } = useAccount();
    const { cards, isLoading, refetch } = usePlayerCards();
    const { data: currentBlockBigint } = useBlockNumber({ watch: true });
    const { repair, isPending, isConfirming, isSuccess, error, reset } = useRepairCard();

    const currentBlock = currentBlockBigint ?? 0n;

    const [targetCard, setTargetCard] = useState<Card | null>(null);
    const [fuelCard, setFuelCard] = useState<Card | null>(null);

    const repairableCards = useMemo(
        () => {
            const list = cards.filter((c) => c.rarity > 1 && !c.isLocked);
            // Sort: decayed first, then by urgency
            return list.sort((a, b) => {
                const da = getDecayInfo(a, currentBlock);
                const db = getDecayInfo(b, currentBlock);
                if (db.decayPoints !== da.decayPoints) return db.decayPoints - da.decayPoints;
                return db.intervalPct - da.intervalPct;
            });
        },
        [cards, currentBlock]
    );

    const eligibleFuel = useMemo(() => {
        if (!targetCard) return [];
        const fuelRarity = requiredFuelRarity(targetCard.rarity);
        return cards.filter(
            (c) => c.rarity === fuelRarity && c.tokenId !== targetCard.tokenId && !c.isLocked
        );
    }, [cards, targetCard]);

    const canRepair = !!targetCard && !!fuelCard && !isPending && !isConfirming;

    const handleSelectTarget = (card: Card) => {
        if (targetCard?.tokenId === card.tokenId) {
            setTargetCard(null);
            setFuelCard(null);
        } else {
            setTargetCard(card);
            setFuelCard(null);
        }
    };

    const handleSelectFuel = (card: Card) => {
        setFuelCard(prev => prev?.tokenId === card.tokenId ? null : card);
    };

    const handleRepair = () => {
        if (!targetCard || !fuelCard) return;
        repair(targetCard.tokenId, fuelCard.tokenId);
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset();
                setTargetCard(null);
                setFuelCard(null);
                refetch();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, reset, refetch]);

    const isProcessing = isPending || isConfirming;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-bold text-white">Repair Cards</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Restore a Rare+ card to full power by sacrificing a fuel card. Decay takes 1 stat point per 7,200 blocks (~24h), capped at 25% loss.
                    </p>
                </div>

                {/* Success */}
                {isSuccess && (
                    <div className="glass rounded-2xl p-6 text-center border border-green-500/20">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <h2 className="text-xl font-display font-bold text-white">Repaired Successfully!</h2>
                        <p className="text-sm text-slate-400 mt-1">Decay clock reset — your card is back to full power.</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <p className="text-sm text-red-400">{error.message}</p>
                        </div>
                    </div>
                )}

                {!address ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4 opacity-30">🔧</div>
                        <h3 className="text-lg font-semibold text-slate-400">Connect your wallet</h3>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-2xl p-4 animate-pulse flex gap-4">
                                <div className="w-20 aspect-[3/4] rounded-xl skeleton shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 w-1/3 rounded skeleton" />
                                    <div className="h-3 w-1/2 rounded skeleton" />
                                    <div className="h-2 w-full rounded skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : repairableCards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4 opacity-30">🔧</div>
                        <h3 className="text-lg font-semibold text-slate-400">No Rare+ cards found</h3>
                        <p className="text-sm text-slate-500 mt-1">Only Rare, Epic, and Legendary cards decay over time.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Step 1 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-primary/20 text-xs font-bold text-accent-glow border border-accent-primary/30">1</span>
                                <h2 className="font-display text-lg font-semibold text-white">Select Card to Repair</h2>
                                <span className="text-xs text-slate-500 ml-auto">{repairableCards.length} card{repairableCards.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                                {repairableCards.map((card) => (
                                    <RepairTargetRow
                                        key={card.tokenId.toString()}
                                        card={card}
                                        selected={targetCard?.tokenId === card.tokenId}
                                        onSelect={() => handleSelectTarget(card)}
                                        currentBlock={currentBlock}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-primary/20 text-xs font-bold text-accent-glow border border-accent-primary/30">2</span>
                                <h2 className="font-display text-lg font-semibold text-white">Select Fuel Card</h2>
                            </div>

                            {!targetCard ? (
                                <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-white/10 text-center px-6">
                                    <ArrowRight className="h-6 w-6 text-slate-600 mb-2" />
                                    <p className="text-sm text-slate-500">Select a card to repair first</p>
                                </div>
                            ) : eligibleFuel.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-red-500/20 text-center px-6">
                                    <AlertTriangle className="h-6 w-6 text-red-400 mb-2" />
                                    <p className="text-sm text-red-400 font-medium">No {RARITY_NAMES[requiredFuelRarity(targetCard.rarity)]} cards available</p>
                                    <p className="text-xs text-slate-500 mt-1">You need a {RARITY_NAMES[requiredFuelRarity(targetCard.rarity)]} card to repair this {RARITY_NAMES[targetCard.rarity]}.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-slate-400 px-1">
                                        Burn a <span className="text-white font-semibold">{RARITY_NAMES[requiredFuelRarity(targetCard.rarity)]}</span> card as fuel — this is permanent.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                                        {eligibleFuel.map((card) => (
                                            <CardDisplay
                                                key={card.tokenId.toString()}
                                                card={card}
                                                selected={fuelCard?.tokenId === card.tokenId}
                                                selectable
                                                onClick={() => handleSelectFuel(card)}
                                                compact
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Summary */}
                            {targetCard && fuelCard && (
                                <div className="glass rounded-2xl p-4 space-y-3 border border-white/5 mt-2">
                                    <h3 className="text-sm font-semibold text-slate-300">Repair Summary</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-slate-500 mb-1">Repairing</p>
                                            <p className="font-semibold text-white truncate">{targetCard.name}</p>
                                            <p className="text-xs text-slate-400">#{targetCard.tokenId.toString()}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-slate-500 mb-1">Burning</p>
                                            <p className="font-semibold text-red-400 truncate">{fuelCard.name}</p>
                                            <p className="text-xs text-slate-400">#{fuelCard.tokenId.toString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setTargetCard(null); setFuelCard(null); }}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all"
                                        >
                                            <X className="h-4 w-4" /> Clear
                                        </button>
                                        <button
                                            onClick={handleRepair}
                                            disabled={!canRepair}
                                            className="flex flex-1 items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white"
                                        >
                                            {isProcessing ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                            ) : (
                                                <><Wrench className="h-4 w-4" /> Confirm Repair</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
