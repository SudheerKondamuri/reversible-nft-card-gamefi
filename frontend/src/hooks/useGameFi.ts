import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { CARD_NFT_ABI, CARD_NFT_ADDRESS, COMBINATION_MANAGER_ABI, COMBINATION_MANAGER_ADDRESS } from '../lib/contracts';

export function useGameFi() {
    const { address, isConnected } = useAccount();

    // Write contracts
    const { data: writeHash, isPending: isWritePending, writeContract } = useWriteContract();

    // Read total minted for mapping
    const { data: totalMintedCall } = useReadContract({
        address: CARD_NFT_ADDRESS,
        abi: CARD_NFT_ABI,
        functionName: 'totalMinted',
        chainId: hardhat.id,
    }) as { data: bigint | undefined };

    const totalMinted = totalMintedCall ? Number(totalMintedCall) : 0;

    // Actions
    const mintTestCard = async () => {
        if (!address) return;
        writeContract({
            address: CARD_NFT_ADDRESS,
            abi: CARD_NFT_ABI,
            functionName: 'mintCard',
            args: [address, 'Test Hero', 1, 'Fire', 10, 10, 'None'],
            chainId: hardhat.id,
        });
    };

    const combineCards = (tokenId1: number, tokenId2: number, fuelCards: number[] = []) => {
        writeContract({
            address: COMBINATION_MANAGER_ADDRESS,
            abi: COMBINATION_MANAGER_ABI,
            functionName: 'combineCards',
            args: [BigInt(tokenId1), BigInt(tokenId2), fuelCards.map(f => BigInt(f))],
            chainId: hardhat.id,
        });
    };

    const fuseCards = (tokenId1: number, tokenId2: number) => {
        writeContract({
            address: COMBINATION_MANAGER_ADDRESS,
            abi: COMBINATION_MANAGER_ABI,
            functionName: 'fuseCards',
            args: [BigInt(tokenId1), BigInt(tokenId2)],
            chainId: hardhat.id,
        });
    };

    const unfuseCard = (fusedTokenId: number) => {
        writeContract({
            address: COMBINATION_MANAGER_ADDRESS,
            abi: COMBINATION_MANAGER_ABI,
            functionName: 'unfuseCard',
            args: [BigInt(fusedTokenId)],
            chainId: hardhat.id,
        });
    };

    return {
        address,
        isConnected,
        totalMinted,
        isWritePending,
        writeHash,
        writeContract,
        mintTestCard,
        combineCards,
        fuseCards,
        unfuseCard
    };
}
