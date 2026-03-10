'use client';

import { useAccount } from 'wagmi';
import { AppShell } from '@/components/layout/AppShell';
import { CardDisplay } from '@/components/cards/CardDisplay';
import { usePlayerCards } from '@/hooks/usePlayerCards';
import { useCombinationPreview } from '@/hooks/useCombinationPreview';
import { useIsValidCombination, useCombineCards, useFuseCards } from '@/hooks/useCombinationContract';
import { useGameStore } from '@/store/gameStore';
import { type Card, RARITY_NAMES, ELEMENT_ICONS, ELEMENT_COLORS } from '@/types/contracts';
import { useMemo, useState } from 'react';
import { ArrowRightLeft, X, Flame, Link2, AlertTriangle, CheckCircle, Loader2, ArrowRight, Trash2 } from 'lucide-react';

export default function CombinePage() {
    const { address } = useAccount();
    const { cards, isLoading, refetch } = usePlayerCards();
    const {
        selectedCard1, selectedCard2, combinationMode, fuelCards,
        selectCard1, selectCard2, swapCards, clearSelection,
        setCombinationMode, addFuelCard, removeFuelCard, clearFuelCards,
    } = useGameStore();

    const [burnConfirmed, setBurnConfirmed] = useState(false);

    // Get full card objects
    const card1 = useMemo(() => cards.find((c) => c.tokenId === selectedCard1) || null, [cards, selectedCard1]);
    const card2 = useMemo(() => cards.find((c) => c.tokenId === selectedCard2) || null, [cards, selectedCard2]);

    // Eligible cards: not locked, not Gen 5
    const eligibleCards = useMemo(
        () => cards.filter((c) => !c.isLocked && c.generation < 5),
        [cards]
    );

    // Preview
    const { preview, isLoading: previewLoading, error: previewError } = useCombinationPreview(
        selectedCard1,
        selectedCard2
    );

    // Validation
    const { data: isValid } = useIsValidCombination(
        selectedCard1 ?? undefined,
        selectedCard2 ?? undefined
    );

    // Transactions
    const { combine, status: combineStatus, isPending: combinePending, isConfirming: combineConfirming, isSuccess: combineSuccess, error: combineError, reset: resetCombine } = useCombineCards();
    const { fuse, status: fuseStatus, isPending: fusePending, isConfirming: fuseConfirming, isSuccess: fuseSuccess, error: fuseError, reset: resetFuse } = useFuseCards();

    const isProcessing = combinePending || combineConfirming || fusePending || fuseConfirming;
    const isSuccess = combineSuccess || fuseSuccess;

    // Fuel requirement
    const fuelRequired = useMemo(() => {
        if (!card1 || !card2) return 0;
        const highestRarity = Math.max(card1.rarity, card2.rarity);
        return highestRarity >= 2 ? highestRarity - 1 : 0;
    }, [card1, card2]);

    const commonCards = useMemo(
        () => cards.filter((c) => c.rarity === 1 && !c.isLocked && c.tokenId !== selectedCard1 && c.tokenId !== selectedCard2),
        [cards, selectedCard1, selectedCard2]
    );

    const handleSelectCard = (card: Card) => {
        if (card.tokenId === selectedCard1) {
            selectCard1(null);
            return;
        }
        if (card.tokenId === selectedCard2) {
            selectCard2(null);
            return;
        }
        if (!selectedCard1) {
            selectCard1(card.tokenId);
        } else if (!selectedCard2) {
            selectCard2(card.tokenId);
        }
    };

    const handleCombine = () => {
        if (!selectedCard1 || !selectedCard2) return;
        if (combinationMode === 'burn-and-mint') {
            combine(selectedCard1, selectedCard2, fuelCards);
        } else {
            fuse(selectedCard1, selectedCard2);
        }
    };

    const handleReset = () => {
        clearSelection();
        clearFuelCards();
        setBurnConfirmed(false);
        resetCombine();
        resetFuse();
        refetch();
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white">Combine Cards</h1>
                    <p className="text-sm text-slate-400 mt-1">Select two cards to combine into a new, more powerful card.</p>
                </div>

                {/* Success state */}
                {isSuccess && (
                    <div className="glass rounded-2xl p-8 text-center animate-bounce-in">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-display font-bold text-white mb-2">Combination Successful!</h2>
                        <p className="text-slate-400 mb-6">Your new card has been minted.</p>
                        <button onClick={handleReset} className="bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl px-6 py-3 transition-all">
                            Combine Again
                        </button>
                    </div>
                )}

                {!isSuccess && (
                    <>
                        {/* Combination Bay */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-lg font-bold text-white">Combination Bay</h2>
                                <div className="flex gap-2">
                                    <button onClick={swapCards} disabled={!selectedCard1 || !selectedCard2} className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-all">
                                        <ArrowRightLeft className="h-3 w-3" /> Swap
                                    </button>
                                    <button onClick={clearSelection} disabled={!selectedCard1 && !selectedCard2} className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs text-red-400 hover:text-red-300 disabled:opacity-30 transition-all">
                                        <X className="h-3 w-3" /> Clear
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-start">
                                {/* Card 1 slot */}
                                <div>
                                    {card1 ? (
                                        <CardDisplay card={card1} />
                                    ) : (
                                        <div className="aspect-[3/5] rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                            <p className="text-sm text-slate-500">Select Card 1</p>
                                        </div>
                                    )}
                                </div>

                                {/* Preview */}
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="text-3xl">⚔️</div>

                                    {preview && (
                                        <div className="glass rounded-2xl p-4 w-full animate-fade-in">
                                            <h3 className="text-sm font-bold text-white text-center mb-3">Result Preview</h3>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Name</span>
                                                    <span className="font-medium text-white">{preview.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Element</span>
                                                    <span className="font-medium" style={{ color: ELEMENT_COLORS[preview.element] }}>
                                                        {ELEMENT_ICONS[preview.element]} {preview.element}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Rarity</span>
                                                    <span className="font-medium text-white">{RARITY_NAMES[preview.rarity]}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Attack</span>
                                                    <span className="font-bold text-red-400">{preview.attack}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Defense</span>
                                                    <span className="font-bold text-blue-400">{preview.defense}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Generation</span>
                                                    <span className="font-medium text-white">Gen {preview.generation}</span>
                                                </div>
                                                <div className="pt-2 border-t border-white/5">
                                                    <span className="text-accent-glow">⚡ {preview.ability}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewError && (
                                        <div className="glass rounded-xl p-3 w-full border border-red-500/20">
                                            <div className="flex items-center gap-2 text-red-400 text-xs">
                                                <AlertTriangle className="h-4 w-4" />
                                                Invalid combination
                                            </div>
                                        </div>
                                    )}

                                    {previewLoading && selectedCard1 && selectedCard2 && (
                                        <Loader2 className="h-6 w-6 text-accent-glow animate-spin" />
                                    )}
                                </div>

                                {/* Card 2 slot */}
                                <div>
                                    {card2 ? (
                                        <CardDisplay card={card2} />
                                    ) : (
                                        <div className="aspect-[3/5] rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                            <p className="text-sm text-slate-500">Select Card 2</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mode Toggle + Action */}
                        {selectedCard1 && selectedCard2 && (
                            <div className="space-y-4 animate-slide-up">
                                {/* Mode toggle */}
                                <div className="glass rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-white mb-3">Combination Mode</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setCombinationMode('burn-and-mint')}
                                            className={`rounded-xl p-4 text-left transition-all border ${combinationMode === 'burn-and-mint'
                                                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                                    : 'glass border-white/5 text-slate-400 hover:border-white/10'
                                                }`}
                                        >
                                            <Flame className="h-5 w-5 mb-2" />
                                            <p className="font-semibold text-sm">Burn & Mint</p>
                                            <p className="text-xs mt-1 opacity-70">Permanent. Burns both originals.</p>
                                        </button>
                                        <button
                                            onClick={() => setCombinationMode('fuse')}
                                            className={`rounded-xl p-4 text-left transition-all border ${combinationMode === 'fuse'
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-300'
                                                    : 'glass border-white/5 text-slate-400 hover:border-white/10'
                                                }`}
                                        >
                                            <Link2 className="h-5 w-5 mb-2" />
                                            <p className="font-semibold text-sm">Fuse</p>
                                            <p className="text-xs mt-1 opacity-70">Reversible. Can unfuse anytime.</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Warnings */}
                                {combinationMode === 'burn-and-mint' && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-red-300">⚠️ Permanent Action</p>
                                                <p className="text-xs text-red-400/80 mt-1">
                                                    Both cards will be permanently burned. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Fuel */}
                                        {fuelRequired > 0 && (
                                            <div className="border-t border-red-500/10 pt-3">
                                                <p className="text-xs text-slate-400 mb-2">
                                                    Fuel required: {fuelRequired} Common card{fuelRequired > 1 ? 's' : ''} (selected: {fuelCards.length})
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {commonCards.slice(0, 10).map((c) => (
                                                        <button
                                                            key={c.tokenId.toString()}
                                                            onClick={() => fuelCards.includes(c.tokenId) ? removeFuelCard(c.tokenId) : addFuelCard(c.tokenId)}
                                                            className={`rounded-lg px-2 py-1 text-xs transition-all ${fuelCards.includes(c.tokenId)
                                                                    ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                                                                    : 'bg-dark-800 text-slate-400 border border-white/5'
                                                                }`}
                                                        >
                                                            #{c.tokenId.toString()} {c.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={burnConfirmed}
                                                onChange={(e) => setBurnConfirmed(e.target.checked)}
                                                className="rounded border-red-500/30 bg-transparent"
                                            />
                                            <span className="text-xs text-red-300">I understand this is permanent and irreversible</span>
                                        </label>
                                    </div>
                                )}

                                {combinationMode === 'fuse' && (
                                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                                        <div className="flex items-start gap-2">
                                            <Link2 className="h-5 w-5 text-green-400 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-green-300">Reversible Fusion</p>
                                                <p className="text-xs text-green-400/80 mt-1">
                                                    Your original cards will be locked and can be recovered by unfusing at any time. A new fused card is minted.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action button */}
                                <button
                                    onClick={handleCombine}
                                    disabled={
                                        isProcessing ||
                                        !isValid ||
                                        (combinationMode === 'burn-and-mint' && (!burnConfirmed || fuelCards.length < fuelRequired))
                                    }
                                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${combinationMode === 'burn-and-mint'
                                            ? 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-lg'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            {combinePending || fusePending ? 'Confirm in Wallet...' : 'Confirming on Chain...'}
                                        </>
                                    ) : (
                                        <>
                                            {combinationMode === 'burn-and-mint' ? <Flame className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
                                            {combinationMode === 'burn-and-mint' ? 'Burn & Mint' : 'Fuse Cards'}
                                        </>
                                    )}
                                </button>

                                {/* Error */}
                                {(combineError || fuseError) && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                                        <p className="text-xs text-red-400">
                                            {(combineError || fuseError)?.message || 'Transaction failed'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Card selection grid */}
                        <div>
                            <h2 className="font-display text-lg font-bold text-white mb-4">
                                Select Cards ({eligibleCards.length} eligible)
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {eligibleCards.map((card) => (
                                    <CardDisplay
                                        key={card.tokenId.toString()}
                                        card={card}
                                        compact
                                        selectable
                                        selected={card.tokenId === selectedCard1 || card.tokenId === selectedCard2}
                                        onClick={() => handleSelectCard(card)}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
