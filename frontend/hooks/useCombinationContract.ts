'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useChainId } from 'wagmi';
import { COMBINATION_MANAGER_ABI, getContractAddresses } from '@/lib/contracts';
import { type TransactionStatus } from '@/types/contracts';
import { useCallback } from 'react';

export function useCombinationContract() {
    const chainId = useChainId();
    const addresses = getContractAddresses(chainId);

    return {
        address: addresses.combinationManager,
        abi: COMBINATION_MANAGER_ABI,
    };
}

export function useIsValidCombination(tokenId1: bigint | undefined, tokenId2: bigint | undefined) {
    const { address, abi } = useCombinationContract();

    return useReadContract({
        address,
        abi,
        functionName: 'isValidCombination',
        args: tokenId1 !== undefined && tokenId2 !== undefined ? [tokenId1, tokenId2] : undefined,
        query: { enabled: tokenId1 !== undefined && tokenId2 !== undefined },
    });
}

export function useFusedData(tokenId: bigint | undefined) {
    const { address, abi } = useCombinationContract();

    return useReadContract({
        address,
        abi,
        functionName: 'fusedCards',
        args: tokenId !== undefined ? [tokenId] : undefined,
        query: { enabled: tokenId !== undefined },
    });
}

export function usePlayerCombinationCount(playerAddress: `0x${string}` | undefined) {
    const { address, abi } = useCombinationContract();

    return useReadContract({
        address,
        abi,
        functionName: 'getPlayerCombinationCount',
        args: playerAddress ? [playerAddress] : undefined,
        query: { enabled: !!playerAddress },
    });
}

export function useLastCombinationBlock(playerAddress: `0x${string}` | undefined) {
    const { address, abi } = useCombinationContract();

    return useReadContract({
        address,
        abi,
        functionName: 'lastCombinationBlock',
        args: playerAddress ? [playerAddress] : undefined,
        query: { enabled: !!playerAddress },
    });
}

export function useCooldownBlocks() {
    const { address, abi } = useCombinationContract();

    return useReadContract({
        address,
        abi,
        functionName: 'COOLDOWN_BLOCKS',
    });
}

export function useCombineCards() {
    const { address, abi } = useCombinationContract();
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const combine = useCallback(
        (tokenId1: bigint, tokenId2: bigint, fuelCards: bigint[]) => {
            writeContract({
                address,
                abi,
                functionName: 'combineCards',
                args: [tokenId1, tokenId2, fuelCards],
            });
        },
        [writeContract, address, abi]
    );

    const status: TransactionStatus = isPending
        ? 'pending'
        : isConfirming
            ? 'confirming'
            : isSuccess
                ? 'confirmed'
                : error
                    ? 'failed'
                    : 'idle';

    return { combine, status, hash, error, isPending, isConfirming, isSuccess, reset };
}

export function useFuseCards() {
    const { address, abi } = useCombinationContract();
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const fuse = useCallback(
        (tokenId1: bigint, tokenId2: bigint) => {
            writeContract({
                address,
                abi,
                functionName: 'fuseCards',
                args: [tokenId1, tokenId2],
            });
        },
        [writeContract, address, abi]
    );

    const status: TransactionStatus = isPending
        ? 'pending'
        : isConfirming
            ? 'confirming'
            : isSuccess
                ? 'confirmed'
                : error
                    ? 'failed'
                    : 'idle';

    return { fuse, status, hash, error, isPending, isConfirming, isSuccess, reset };
}

export function useUnfuseCard() {
    const { address, abi } = useCombinationContract();
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const unfuse = useCallback(
        (fusedTokenId: bigint) => {
            writeContract({
                address,
                abi,
                functionName: 'unfuseCard',
                args: [fusedTokenId],
            });
        },
        [writeContract, address, abi]
    );

    const status: TransactionStatus = isPending
        ? 'pending'
        : isConfirming
            ? 'confirming'
            : isSuccess
                ? 'confirmed'
                : error
                    ? 'failed'
                    : 'idle';

    return { unfuse, status, hash, error, isPending, isConfirming, isSuccess, reset };
}
