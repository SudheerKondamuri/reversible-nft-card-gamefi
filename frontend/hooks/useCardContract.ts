'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount, useChainId } from 'wagmi';
import { CARD_NFT_ABI, getContractAddresses } from '@/lib/contracts';
import { type TransactionStatus } from '@/types/contracts';
import { useState, useCallback } from 'react';

export function useCardContract() {
    const chainId = useChainId();
    const { address } = useAccount();
    const addresses = getContractAddresses(chainId);

    return {
        address: addresses.cardNFT,
        abi: CARD_NFT_ABI,
    };
}

export function useCardAttributes(tokenId: bigint | undefined) {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'getCardAttributes',
        args: tokenId !== undefined ? [tokenId] : undefined,
        query: { enabled: tokenId !== undefined },
    });
}

export function useIsLocked(tokenId: bigint | undefined) {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'isLocked',
        args: tokenId !== undefined ? [tokenId] : undefined,
        query: { enabled: tokenId !== undefined },
    });
}

export function useTotalMinted() {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'totalMinted',
    });
}

export function useTotalSupplyByRarity(rarity: number) {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'getTotalSupplyByRarity',
        args: [rarity],
    });
}

export function useTotalSupplyByElement(element: string) {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'getTotalSupplyByElement',
        args: [element],
    });
}

export function useContractOwner() {
    const { address, abi } = useCardContract();

    return useReadContract({
        address,
        abi,
        functionName: 'owner',
    });
}

export function useMintCard() {
    const { address, abi } = useCardContract();
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const mint = useCallback(
        async (
            to: `0x${string}`,
            name: string,
            rarity: number,
            element: string,
            attack: number,
            defense: number,
            ability: string
        ) => {
            writeContract({
                address,
                abi,
                functionName: 'mintCard',
                args: [to, name, rarity, element, attack, defense, ability],
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

    return { mint, status, hash, error, isPending, isConfirming, isSuccess };
}
