'use client'

import { useReadContract } from 'wagmi';
import { COMBINATION_MANAGER_ABI, COMBINATION_MANAGER_ADDRESS } from '../lib/contracts';
import { useGameFi } from '../hooks/useGameFi';
import { CardData } from '../hooks/useCardInventory';

interface FusionChamberProps {
    selectedCards: CardData[];
    onClearSelection: () => void;
}

export function FusionChamber({ selectedCards, onClearSelection }: FusionChamberProps) {
    const { combineCards, fuseCards, isWritePending } = useGameFi();

    // Read preview if two cards are selected
    const hasTwoCards = selectedCards.length === 2;

    const { data: previewData, isLoading: isPreviewLoading } = useReadContract({
        address: COMBINATION_MANAGER_ADDRESS,
        abi: COMBINATION_MANAGER_ABI,
        functionName: 'getCombinationPreview',
        args: hasTwoCards ? [BigInt(selectedCards[0].tokenId), BigInt(selectedCards[1].tokenId)] : undefined,
        query: {
            enabled: hasTwoCards,
        }
    });

    if (selectedCards.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: "40px", textAlign: "center", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h3 style={{ color: "var(--text-dim)" }}>Fusion Chamber Empty</h3>
                <p>Select cards from your inventory to begin.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: "32px", position: "relative" }}>
            <button
                style={{ position: "absolute", top: "16px", right: "24px", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "1.2rem" }}
                onClick={onClearSelection}
            >
                ×
            </button>

            <h2 style={{ marginBottom: "24px", background: "linear-gradient(90deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Fusion Chamber
            </h2>

            <div style={{ display: "flex", gap: "20px", marginBottom: "32px", alignItems: "center", justifyContent: "center" }}>
                {selectedCards.map((card, idx) => (
                    <div key={card.tokenId} style={{ textAlign: "center" }}>
                        <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "12px", minWidth: "120px" }}>
                            <h4>{card.name}</h4>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Gen {card.generation}</p>
                        </div>
                        {idx === 0 && selectedCards.length === 2 && (
                            <span style={{ fontSize: "2rem", margin: "0 20px", color: "var(--primary)", position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>+</span>
                        )}
                    </div>
                ))}

                {selectedCards.length === 1 && (
                    <div style={{ padding: "16px", borderRadius: "12px", border: "1px dashed var(--border)", minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}>
                        Select another
                    </div>
                )}
            </div>

            {hasTwoCards && (
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "24px", border: "1px solid var(--border)" }}>
                    <h3 style={{ marginBottom: "16px", textAlign: "center" }}>Expected Outcome</h3>

                    {isPreviewLoading ? (
                        <p style={{ textAlign: "center", color: "var(--text-dim)" }}>Analyzing matrix...</p>
                    ) : previewData ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", textAlign: "center" }}>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Element</span>
                                <p style={{ fontWeight: 600, fontSize: "1.2rem", textTransform: 'capitalize' }}>{(previewData as any)[0]}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Generation</span>
                                <p style={{ fontWeight: 600, fontSize: "1.2rem" }}>{(previewData as any)[5]}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Attack</span>
                                <p style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--secondary)" }}>{(previewData as any)[1]}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Defense</span>
                                <p style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--primary)" }}>{(previewData as any)[2]}</p>
                            </div>
                        </div>
                    ) : null}

                    <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                        <button
                            className="btn-outline"
                            style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)" }}
                            onClick={() => fuseCards(selectedCards[0].tokenId, selectedCards[1].tokenId)}
                            disabled={isWritePending}
                        >
                            {isWritePending ? 'Processing...' : 'Reversible Fuse (Lock)'}
                        </button>
                        <button
                            className="btn-primary"
                            style={{ flex: 1 }}
                            onClick={() => combineCards(selectedCards[0].tokenId, selectedCards[1].tokenId)}
                            disabled={isWritePending}
                        >
                            {isWritePending ? 'Processing...' : 'Combine (Burn)'}
                        </button>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", textAlign: "center", marginTop: "12px" }}>
                        * Combining permanently burns the parent cards. Fusing locks them but allows unfusing later.
                    </p>
                </div>
            )}
        </div>
    );
}
