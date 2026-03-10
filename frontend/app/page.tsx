'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Swords, Merge, Layers, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

const features = [
    {
        icon: Layers,
        title: 'Collect & Trade',
        desc: 'Collect NFT cards with unique elements, abilities, and rarity tiers from Common to Legendary.',
        color: '#3b82f6',
    },
    {
        icon: Merge,
        title: 'Combine Cards',
        desc: 'Burn-and-Mint or Fuse two cards to create powerful new generation cards with bonus stats.',
        color: '#a855f7',
    },
    {
        icon: Sparkles,
        title: 'Reversible Fusion',
        desc: 'Unlike traditional burning, fused cards can be unfused at any time, recovering your originals.',
        color: '#22c55e',
    },
    {
        icon: BarChart3,
        title: 'Live Economics',
        desc: 'Track real-time supply distribution, combination stats, and leaderboards directly from the blockchain.',
        color: '#f59e0b',
    },
];

export default function HomePage() {
    const { isConnected } = useAccount();

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[200px]" />
            </div>

            {/* Navigation bar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow-sm">
                        <Swords className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-display text-xl font-bold text-white">CardFi</span>
                </div>
                <ConnectButton showBalance={false} />
            </nav>

            {/* Hero */}
            <section className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-20">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 animate-fade-in">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-slate-300">Live on Hardhat & Sepolia</span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
                    <span className="text-white">The First </span>
                    <span className="text-gradient">Reversible</span>
                    <br />
                    <span className="text-white">NFT Card Game</span>
                </h1>

                <p className="max-w-2xl text-lg text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Combine, fuse, and unfuse unique elemental NFT cards. Dual-layer mechanics let you experiment without risk — unfuse anytime to recover your originals.
                </p>

                <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {isConnected ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-secondary hover:to-accent-primary text-white font-semibold rounded-xl px-8 py-3.5 shadow-glow-md transition-all duration-300 hover:shadow-glow-lg hover:scale-105"
                        >
                            Open Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <ConnectButton label="Connect Wallet to Start" />
                    )}
                </div>

                {/* Floating cards decoration */}
                <div className="relative mt-16 w-full max-w-3xl mx-auto">
                    <div className="flex justify-center gap-4">
                        {['🔥', '💧', '⚡'].map((emoji, i) => (
                            <div
                                key={i}
                                className="w-32 h-44 rounded-2xl glass flex items-center justify-center text-5xl animate-float"
                                style={{
                                    animationDelay: `${i * 0.3}s`,
                                    transform: `rotate(${(i - 1) * 8}deg)`,
                                }}
                            >
                                {emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="glass glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                            style={{ animationDelay: `${0.1 * i}s` }}
                        >
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                                style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}
                            >
                                <f.icon className="h-6 w-6" style={{ color: f.color }} />
                            </div>
                            <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-6">
                <p className="text-center text-xs text-slate-500">
                    Reversible NFT Card GameFi • Built with Next.js, wagmi & Solidity
                </p>
            </footer>
        </div>
    );
}
