'use client';

import { useState, useCallback } from 'react';
import { useChainId, usePublicClient } from 'wagmi';
import { CARD_NFT_ABI, COMBINATION_MANAGER_ABI, getContractAddresses } from '@/lib/contracts';
import { type ContractEvent } from '@/types/contracts';

export function useContractEvents() {
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const addresses = getContractAddresses(chainId);

    const [events, setEvents] = useState<ContractEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCardNFTEvents = useCallback(async () => {
        if (!publicClient) return [];

        const [mintedLogs, burnedLogs] = await Promise.all([
            publicClient.getContractEvents({
                address: addresses.cardNFT,
                abi: CARD_NFT_ABI,
                eventName: 'CardMinted',
                fromBlock: 0n,
            }),
            publicClient.getContractEvents({
                address: addresses.cardNFT,
                abi: CARD_NFT_ABI,
                eventName: 'CardBurned',
                fromBlock: 0n,
            }),
        ]);

        const mapped: ContractEvent[] = [
            ...mintedLogs.map((log) => ({
                eventName: 'CardMinted',
                args: log.args as Record<string, unknown>,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            })),
            ...burnedLogs.map((log) => ({
                eventName: 'CardBurned',
                args: log.args as Record<string, unknown>,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            })),
        ];

        return mapped;
    }, [publicClient, addresses]);

    const fetchCombinationEvents = useCallback(async () => {
        if (!publicClient) return [];

        const [combinedLogs, fusedLogs, unfusedLogs] = await Promise.all([
            publicClient.getContractEvents({
                address: addresses.combinationManager,
                abi: COMBINATION_MANAGER_ABI,
                eventName: 'CardsCombined',
                fromBlock: 0n,
            }),
            publicClient.getContractEvents({
                address: addresses.combinationManager,
                abi: COMBINATION_MANAGER_ABI,
                eventName: 'CardsFused',
                fromBlock: 0n,
            }),
            publicClient.getContractEvents({
                address: addresses.combinationManager,
                abi: COMBINATION_MANAGER_ABI,
                eventName: 'CardUnfused',
                fromBlock: 0n,
            }),
        ]);

        const mapped: ContractEvent[] = [
            ...combinedLogs.map((log) => ({
                eventName: 'CardsCombined',
                args: log.args as Record<string, unknown>,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            })),
            ...fusedLogs.map((log) => ({
                eventName: 'CardsFused',
                args: log.args as Record<string, unknown>,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            })),
            ...unfusedLogs.map((log) => ({
                eventName: 'CardUnfused',
                args: log.args as Record<string, unknown>,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            })),
        ];

        return mapped;
    }, [publicClient, addresses]);

    const fetchAllEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const [cardEvents, comboEvents] = await Promise.all([
                fetchCardNFTEvents(),
                fetchCombinationEvents(),
            ]);
            const all = [...cardEvents, ...comboEvents].sort(
                (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
            );
            setEvents(all);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCardNFTEvents, fetchCombinationEvents]);

    return { events, isLoading, fetchAllEvents, fetchCombinationEvents };
}
