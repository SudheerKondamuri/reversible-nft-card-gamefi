'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { CARD_NFT_ABI, COMBINATION_MANAGER_ABI, getContractAddresses } from '@/lib/contracts';
import { type Card } from '@/types/contracts';

export function usePlayerCards() {
    const { address: userAddress } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const addresses = getContractAddresses(chainId);

    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
        if (!userAddress || !publicClient) return;

        setIsLoading(true);
        setError(null);

        try {
            // Get total minted to know the range of token IDs
            const totalMinted = await publicClient.readContract({
                address: addresses.cardNFT,
                abi: CARD_NFT_ABI,
                functionName: 'totalMinted',
            });

            // Fetch base image URI once
            const rawBaseURI = await publicClient.readContract({
                address: addresses.cardNFT,
                abi: CARD_NFT_ABI,
                functionName: 'getBaseImageURI',
            }) as string;
            // Convert ipfs:// → Pinata gateway so browsers can load it
            const baseImageURI = rawBaseURI.startsWith('ipfs://')
                ? rawBaseURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                : rawBaseURI;

            const playerCards: Card[] = [];

            // Iterate through all token IDs and check ownership
            for (let i = 1n; i <= totalMinted; i++) {
                try {
                    const owner = await publicClient.readContract({
                        address: addresses.cardNFT,
                        abi: CARD_NFT_ABI,
                        functionName: 'ownerOf',
                        args: [i],
                    });

                    if (owner.toLowerCase() === userAddress.toLowerCase()) {
                        const attrs = await publicClient.readContract({
                            address: addresses.cardNFT,
                            abi: CARD_NFT_ABI,
                            functionName: 'getCardAttributes',
                            args: [i],
                        });

                        const locked = await publicClient.readContract({
                            address: addresses.cardNFT,
                            abi: CARD_NFT_ABI,
                            functionName: 'isLocked',
                            args: [i],
                        });

                        // Check if fused
                        let isFused = false;
                        try {
                            const fusedData = await publicClient.readContract({
                                address: addresses.combinationManager,
                                abi: COMBINATION_MANAGER_ABI,
                                functionName: 'fusedCards',
                                args: [i],
                            });
                            isFused = fusedData[2]; // isActive field
                        } catch {
                            // Not a fused card
                        }

                        playerCards.push({
                            tokenId: i,
                            name: attrs[0],
                            rarity: attrs[1],
                            element: attrs[2],
                            attack: attrs[3],
                            defense: attrs[4],
                            ability: attrs[5],
                            generation: attrs[6],
                            isLocked: locked,
                            isFused,
                            imageURI: baseImageURI ? `${baseImageURI}${attrs[0]}.png` : undefined,
                        });
                    }
                } catch {
                    // Token doesn't exist (burned) — skip
                }
            }

            setCards(playerCards);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        } finally {
            setIsLoading(false);
        }
    }, [userAddress, publicClient, addresses]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    return { cards, isLoading, error, refetch: fetchCards };
}
