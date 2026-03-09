'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useBalance } from 'wagmi';
import { AlertTriangle } from 'lucide-react';

const SUPPORTED_CHAINS = [31337, 11155111];

export function Header() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: balance } = useBalance({ address });
    const isUnsupportedNetwork = isConnected && !SUPPORTED_CHAINS.includes(chainId);

    return (
        <header className="sticky top-0 z-30 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {isUnsupportedNetwork && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-medium text-amber-400">
                                Unsupported network. Please switch to Hardhat or Sepolia.
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isConnected && balance && (
                        <div className="glass rounded-xl px-4 py-2 mr-2">
                            <span className="text-xs text-slate-400">Balance</span>
                            <p className="text-sm font-semibold text-white">
                                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                            </p>
                        </div>
                    )}
                    <ConnectButton
                        showBalance={false}
                        chainStatus="icon"
                        accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
