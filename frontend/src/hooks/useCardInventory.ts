import { useReadContracts } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { CARD_NFT_ABI, CARD_NFT_ADDRESS } from '../lib/contracts';

export type CardData = {
    tokenId: number;
    name: string;
    rarity: number;
    element: string;
    attack: number;
    defense: number;
    ability: string;
    generation: number;
};

export function useCardInventory(address: `0x${string}` | undefined, totalMinted: number) {
    // 1. Fetch owners for all tokens from 1 to totalMinted
    const ownerContracts = Array.from({ length: totalMinted }, (_, i) => ({
        address: CARD_NFT_ADDRESS,
        abi: CARD_NFT_ABI,
        functionName: 'ownerOf',
        args: [BigInt(i + 1)],
        chainId: hardhat.id,
    }));

    const { data: ownersData } = useReadContracts({
        contracts: ownerContracts as any,
    });

    // Filter tokenIds owned by the connected user
    const ownedTokenIds: number[] = [];
    if (ownersData && address) {
        ownersData.forEach((result, index) => {
            if (result.status === 'success' && (result.result as string).toLowerCase() === address.toLowerCase()) {
                ownedTokenIds.push(index + 1);
            }
        });
    }

    // 2. Fetch attributes for owned tokens
    const attrContracts = ownedTokenIds.map(id => ({
        address: CARD_NFT_ADDRESS,
        abi: CARD_NFT_ABI,
        functionName: 'getCardAttributes',
        args: [BigInt(id)],
        chainId: hardhat.id,
    }));

    const { data: attrData } = useReadContracts({
        contracts: attrContracts as any,
    });

    const cards: CardData[] = [];
    if (attrData) {
        attrData.forEach((result, i) => {
            if (result.status === 'success') {
                const [name, rarity, element, attack, defense, ability, generation] = result.result as any;
                cards.push({
                    tokenId: ownedTokenIds[i],
                    name,
                    rarity,
                    element,
                    attack,
                    defense,
                    ability,
                    generation
                });
            }
        });
    }

    return { cards };
}
