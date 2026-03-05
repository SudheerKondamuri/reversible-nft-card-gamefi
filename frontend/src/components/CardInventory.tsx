'use client'

import { useAccount } from 'wagmi';
import { useGameFi } from '../hooks/useGameFi';
import { useCardInventory, CardData } from '../hooks/useCardInventory';

interface CardInventoryProps {
    onSelectCard?: (card: CardData) => void;
    selectedCardIds?: number[];
    title?: string;
}

export function CardInventory({ onSelectCard, selectedCardIds = [], title = "Your Cards" }: CardInventoryProps) {
    const { address } = useAccount();
    const { totalMinted, unfuseCard, isWritePending } = useGameFi();
    const { cards } = useCardInventory(address, totalMinted);

    // Return a style object based on the element
    const getElementStyle = (element: string) => {
        switch (element.toLowerCase()) {
            case 'fire': return { borderTop: '4px solid var(--fire)' };
            case 'water': return { borderTop: '4px solid var(--water)' };
            case 'earth': return { borderTop: '4px solid var(--earth)' };
            case 'air': return { borderTop: '4px solid var(--air)' };
            default: return { borderTop: '4px solid var(--void)' };
        }
    };

    const rarityMap = ["Unknown", "Common", "Rare", "Epic", "Legendary"];

    if (!address) return <p>Please connect wallet to view inventory.</p>;
    if (cards.length === 0) return <p>No cards found in your wallet.</p>;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h3>{title}</h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "1rem"
            }}>
                {cards.map(card => {
                    const isSelected = selectedCardIds.includes(card.tokenId);
                    return (
                        <div
                            key={card.tokenId}
                            className="glass-panel"
                            style={{
                                ...getElementStyle(card.element),
                                padding: "16px",
                                cursor: onSelectCard ? "pointer" : "default",
                                transform: isSelected ? "translateY(-5px)" : "none",
                                boxShadow: isSelected ? "0 8px 32px 0 rgba(157, 78, 221, 0.5)" : undefined,
                                border: isSelected ? "1px solid var(--primary)" : undefined
                            }}
                            onClick={() => onSelectCard && onSelectCard(card)}
                        >
                            <h4 style={{ margin: "0 0 8px 0" }}>{card.name}</h4>
                            <p style={{ fontSize: "0.8rem", margin: "0 0 12px 0" }}>
                                <span>#{card.tokenId}</span> | <span>Gen {card.generation}</span>
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>Rarity</span>
                                <span style={{ fontWeight: 600 }}>{rarityMap[card.rarity] || card.rarity}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>Element</span>
                                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{card.element}</span>
                            </div>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "8px",
                                marginTop: "16px",
                                background: "rgba(0,0,0,0.2)",
                                padding: "8px",
                                borderRadius: "8px"
                            }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>ATK</div>
                                    <div style={{ fontWeight: 800, color: "var(--secondary)" }}>{card.attack}</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>DEF</div>
                                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>{card.defense}</div>
                                </div>
                            </div>

                            {card.name.startsWith("Fused-") && (
                                <button
                                    className="btn-outline"
                                    style={{ width: "100%", marginTop: "12px", fontSize: "0.8rem", padding: "8px", borderColor: "var(--secondary)", color: "var(--secondary)" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unfuseCard(card.tokenId);
                                    }}
                                    disabled={isWritePending}
                                >
                                    Unfuse Card
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
