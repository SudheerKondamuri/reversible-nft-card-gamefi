'use client'

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '../components/WalletConnect';
import { CardInventory } from '../components/CardInventory';
import { FusionChamber } from '../components/FusionChamber';
import { CardData } from '../hooks/useCardInventory';
import { useGameFi } from '../hooks/useGameFi';

export default function Home() {
  const { isConnected } = useAccount();
  const { mintTestCard, isWritePending } = useGameFi();

  const [selectedCards, setSelectedCards] = useState<CardData[]>([]);

  const handleSelectCard = (card: CardData) => {
    // If it's already selected, deselect it
    if (selectedCards.find(c => c.tokenId === card.tokenId)) {
      setSelectedCards(prev => prev.filter(c => c.tokenId !== card.tokenId));
      return;
    }

    // Limit selection to 2 cards
    if (selectedCards.length < 2) {
      setSelectedCards(prev => [...prev, card]);
    }
  };

  const handleClearSelection = () => {
    setSelectedCards([]);
  };

  return (
    <main className="container">
      <nav className="header-nav">
        <div className="logo">Reversible GameFi</div>
        <WalletConnect />
      </nav>

      {!isConnected ? (
        <div className="glass-panel" style={{ padding: "60px", textAlign: "center", marginTop: "40px" }}>
          <h2>Welcome to the Next Generation of On-Chain Gaming</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 32px", fontSize: "1.1rem" }}>
            Connect your wallet to experience reversible fusions and true asset deflation.
            Build your deck, fuse elements, and conquer without losing underlying value.
          </p>
          <WalletConnect />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <p>Select cards to bring into the chamber.</p>
            <button
              className="btn-outline"
              onClick={mintTestCard}
              disabled={isWritePending}
            >
              {isWritePending ? 'Minting...' : 'Mint Test Card (Owner Only)'}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "40px", alignItems: "start" }}>
            {/* Left Column: Inventory */}
            <div>
              <CardInventory
                onSelectCard={handleSelectCard}
                selectedCardIds={selectedCards.map(c => c.tokenId)}
              />
            </div>

            {/* Right Column: Fusion Chamber & Actions */}
            <div style={{ position: "sticky", top: "40px" }}>
              <FusionChamber
                selectedCards={selectedCards}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
