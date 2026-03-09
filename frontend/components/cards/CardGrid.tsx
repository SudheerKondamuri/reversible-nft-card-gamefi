'use client';

import { type Card } from '@/types/contracts';
import { CardDisplay } from './CardDisplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardGridProps {
    cards: Card[];
    isLoading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onCardClick?: (card: Card) => void;
    selectedIds?: bigint[];
    selectable?: boolean;
    pageSize?: number;
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-dark-600/50 p-4 animate-pulse">
            <div className="flex justify-between mb-3">
                <div className="h-6 w-20 rounded-full skeleton" />
                <div className="h-4 w-16 rounded skeleton" />
            </div>
            <div className="w-full aspect-[3/4] rounded-xl skeleton mb-3" />
            <div className="h-4 w-3/4 rounded skeleton mb-2" />
            <div className="h-3 w-1/3 rounded skeleton mb-3" />
            <div className="space-y-2">
                <div className="h-3 rounded skeleton" />
                <div className="h-3 rounded skeleton" />
            </div>
        </div>
    );
}

export function CardGrid({
    cards,
    isLoading,
    currentPage,
    onPageChange,
    onCardClick,
    selectedIds = [],
    selectable = false,
    pageSize = 24,
}: CardGridProps) {
    const totalPages = Math.ceil(cards.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const pageCards = cards.slice(startIdx, startIdx + pageSize);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4 opacity-30">🃏</div>
                <h3 className="text-lg font-semibold text-slate-400">No cards found</h3>
                <p className="text-sm text-slate-500 mt-1">Connect your wallet or adjust your filters.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pageCards.map((card) => (
                    <CardDisplay
                        key={card.tokenId.toString()}
                        card={card}
                        selected={selectedIds.includes(card.tokenId)}
                        selectable={selectable}
                        onClick={() => onCardClick?.(card)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center h-9 w-9 rounded-lg glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) {
                            pageNum = i + 1;
                        } else if (currentPage <= 4) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                        } else {
                            pageNum = currentPage - 3 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                                        ? 'bg-accent-primary text-white shadow-glow-sm'
                                        : 'glass text-slate-400 hover:text-white'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center h-9 w-9 rounded-lg glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
