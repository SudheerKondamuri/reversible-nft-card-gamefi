'use client';

import { useReadContract, useChainId } from 'wagmi';
import { COMBINATION_MANAGER_ABI, getContractAddresses } from '@/lib/contracts';
import { type CombinationPreview } from '@/types/contracts';
import { useMemo } from 'react';

export function useCombinationPreview(tokenId1: bigint | null, tokenId2: bigint | null) {
    const chainId = useChainId();
    const addresses = getContractAddresses(chainId);
    const enabled = tokenId1 !== null && tokenId2 !== null;

    const { data, isLoading, error, refetch } = useReadContract({
        address: addresses.combinationManager,
        abi: COMBINATION_MANAGER_ABI,
        functionName: 'getCombinationPreview',
        args: enabled ? [tokenId1!, tokenId2!] : undefined,
        query: { enabled },
    });

    const preview: CombinationPreview | null = useMemo(() => {
        if (!data) return null;
        return {
            element: data[0],
            attack: data[1],
            defense: data[2],
            rarity: data[3],
            ability: data[4],
            generation: data[5],
            name: data[6],
        };
    }, [data]);

    return {
        preview,
        isLoading,
        error: error ? (error as Error).message : null,
        refetch,
    };
}
