# NFT Card Game Frontend

A production-quality Web3 frontend for the Reversible NFT Card Game, built with **Next.js 14**, **TypeScript**, **wagmi/viem**, **RainbowKit**, **Tailwind CSS**, and **Recharts**.

## Features

- 🎴 **Card Collection Dashboard** — View, filter, sort, and search your NFT cards with rarity-coded glowing borders
- ⚔️ **Combination Interface** — Select two cards, see live preview results, choose Burn-and-Mint or Fuse mode
- 🔓 **Unfuse Management** — View fused cards, monitor cooldown timers, and recover originals
- 📊 **Economic Dashboard** — Real-time supply charts (Recharts), combination stats, and leaderboard
- 🛡️ **Admin Panel** — Owner-only batch minting and contract event logs
- 🔗 **Wallet Connection** — RainbowKit with MetaMask, WalletConnect, and more

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Web3 | wagmi + viem |
| Wallet | RainbowKit |
| Styling | Tailwind CSS |
| State | Zustand |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- A running Hardhat node with deployed contracts

### 1. Start the Hardhat Node
```bash
cd /path/to/reversible-nft-card-gamefi
npx hardhat node
```

### 2. Deploy Contracts
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Configure Environment (optional)
Create `.env.local`:
```env
NEXT_PUBLIC_CARD_NFT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_COMBINATION_MANAGER_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── dashboard/page.tsx        # Card collection dashboard
│   ├── combine/page.tsx          # Combination interface
│   ├── unfuse/page.tsx           # Fused card management
│   ├── stats/page.tsx            # Economic dashboard
│   └── admin/page.tsx            # Admin panel (owner-only)
├── components/
│   ├── cards/
│   │   ├── CardDisplay.tsx       # Visual NFT card component
│   │   └── CardGrid.tsx          # Responsive paginated grid
│   └── layout/
│       ├── AppShell.tsx          # Main layout shell
│       ├── Header.tsx            # Header with wallet + network
│       └── Sidebar.tsx           # Navigation sidebar
├── hooks/
│   ├── useCardContract.ts        # CardNFT interactions
│   ├── useCombinationContract.ts # CombinationManager interactions
│   ├── usePlayerCards.ts         # Fetch user's card collection
│   ├── useCombinationPreview.ts  # Live combination preview
│   ├── useTransactionStatus.ts   # Transaction lifecycle tracking
│   └── useContractEvents.ts      # Contract event queries
├── lib/
│   ├── contracts.ts              # ABIs and contract addresses
│   ├── wagmi.ts                  # Wagmi + chain configuration
│   └── providers.tsx             # Provider wrapper component
├── store/
│   └── gameStore.ts              # Zustand state management
├── types/
│   └── contracts.ts              # TypeScript interfaces & constants
└── README.md
```

## Smart Contracts

This frontend interacts with two deployed contracts:

- **CardNFT** (ERC721) — Manages card NFTs with rarity, element, stats, generation, and decay mechanics
- **CombinationManager** — Handles card combinations (burn-and-mint + reversible fusion)

## Build for Production

```bash
npm run build
npm start
```
