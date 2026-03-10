'use client';

import { useAccount, usePublicClient, useChainId, useBlockNumber } from 'wagmi';
import { AppShell } from '@/components/layout/AppShell';
import { CardDisplay } from '@/components/cards/CardDisplay';
import { usePlayerCards } from '@/hooks/usePlayerCards';
import { useFusedData, useUnfuseCard, useLastCombinationBlock, useCooldownBlocks } from '@/hooks/useCombinationContract';
import { type Card } from '@/types/contracts';
import { useMemo, useState, useEffect } from 'react';
import { Unlink, Loader2, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

function CooldownTimer({ lastBlock, cooldownBlocks, currentBlock }: { lastBlock: bigint; cooldownBlocks: bigint; currentBlock: bigint }) {
    const endBlock = lastBlock + cooldownBlocks;
    const remaining = endBlock > currentBlock ? Number(endBlock - currentBlock) : 0;

    if (remaining === 0) {
        return <span className="text-xs text-green-400 font-medium">✓ Ready</span>;
    }

    return (
        <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 font-medium">{remaining} blocks remaining</span>
        </div>
    );
}

interface FusedCardEntryProps {
    card: Card;
    onUnfuse: (tokenId: bigint) => void;
    isProcessing: boolean;
    lastBlock: bigint;
    cooldownBlocks: bigint;
    currentBlock: bigint;
}

function FusedCardEntry({ card, onUnfuse, isProcessing, lastBlock, cooldownBlocks, currentBlock }: FusedCardEntryProps) {
    const endBlock = lastBlock + cooldownBlocks;
    const canUnfuse = currentBlock >= endBlock;

    return (
        <div className="glass rounded-2xl p-5 animate-fade-in">
            <div className="flex gap-5">
                <div className="w-48 shrink-0">
                    <CardDisplay card={card} compact />
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="font-display text-lg font-bold text-white">{card.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">Token #{card.tokenId.toString()} • Fused Card</p>
                    </div>

                    <div className="glass rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Status</span>
                            <CooldownTimer lastBlock={lastBlock} cooldownBlocks={cooldownBlocks} currentBlock={currentBlock} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Unfuse Fee</span>
                            <span className="text-xs text-green-400 font-medium">Free</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onUnfuse(card.tokenId)}
                        disabled={!canUnfuse || isProcessing}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-3 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white"
                    >
                        {isProcessing ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                        ) : (
                            <><Unlink className="h-4 w-4" /> Unfuse Card</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UnfusePage() {
    const { address } = useAccount();
    const { cards, isLoading, refetch } = usePlayerCards();
    const { data: currentBlockBigint } = useBlockNumber({ watch: true });
    const { data: lastBlock } = useLastCombinationBlock(address);
    const { data: cooldownBlocks } = useCooldownBlocks();
    const { unfuse, status, isPending, isConfirming, isSuccess, error, reset } = useUnfuseCard();

    const [unfusingId, setUnfusingId] = useState<bigint | null>(null);

    const currentBlock = currentBlockBigint ?? 0n;

    // Filter fused cards
    const fusedCards = useMemo(() => cards.filter((c) => c.isFused), [cards]);

    const handleUnfuse = (tokenId: bigint) => {
        setUnfusingId(tokenId);
        unfuse(tokenId);
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset();
                setUnfusingId(null);
                refetch();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, reset, refetch]);

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white">Unfuse Cards</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Split fused cards back into their original components. {fusedCards.length} fused card{fusedCards.length !== 1 ? 's' : ''} found.
                    </p>
                </div>

                {/* Success toast */}
                {isSuccess && (
                    <div className="glass rounded-2xl p-6 text-center border border-green-500/20 animate-bounce-in">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <h2 className="text-xl font-display font-bold text-white">Unfused Successfully!</h2>
                        <p className="text-sm text-slate-400 mt-1">Your original cards have been recovered.</p>
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

                {/* Fused cards list */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                                <div className="flex gap-5">
                                    <div className="w-48 aspect-[3/4] rounded-xl skeleton" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-1/3 rounded skeleton" />
                                        <div className="h-3 w-1/2 rounded skeleton" />
                                        <div className="h-20 rounded-xl skeleton" />
                                        <div className="h-10 rounded-xl skeleton" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : fusedCards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4 opacity-30">🔗</div>
                        <h3 className="text-lg font-semibold text-slate-400">No fused cards</h3>
                        <p className="text-sm text-slate-500 mt-1">Fuse cards on the Combine page to see them here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {fusedCards.map((card) => (
                            <FusedCardEntry
                                key={card.tokenId.toString()}
                                card={card}
                                onUnfuse={handleUnfuse}
                                isProcessing={(isPending || isConfirming) && unfusingId === card.tokenId}
                                lastBlock={lastBlock ?? 0n}
                                cooldownBlocks={cooldownBlocks ?? 100n}
                                currentBlock={currentBlock}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
