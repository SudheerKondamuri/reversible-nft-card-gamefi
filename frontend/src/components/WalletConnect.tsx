'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
