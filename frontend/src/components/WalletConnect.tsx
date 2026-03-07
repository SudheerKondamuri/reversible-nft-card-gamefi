'use client'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { hardhat } from 'wagmi/chains';

export function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const isWrongNetwork = isConnected && chainId !== hardhat.id;

    if (isConnected) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isWrongNetwork && (
                    <button
                        className="btn-primary"
                        style={{ background: 'var(--fire, #e74c3c)', border: 'none', fontSize: '0.85rem' }}
                        onClick={() => switchChain({ chainId: hardhat.id })}
                    >
                        ⚠ Wrong Network — Switch to Hardhat
                    </button>
                )}
                <p style={{ margin: 0 }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <button className="btn-outline" onClick={() => disconnect()}>
                    Disconnect
                </button>
            </div>
        );
    }

    const injectedConnector = connectors.find(c => c.id === 'injected');

    return (
        <button className="btn-primary" onClick={() => connect({ connector: injectedConnector! })}>
            Connect Wallet
        </button>
    );
}
