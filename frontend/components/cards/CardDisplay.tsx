'use client';

import React from 'react';
import { clsx } from 'clsx';
import { type Card, RARITY_NAMES, ELEMENT_COLORS, ELEMENT_ICONS } from '@/types/contracts';
import { Lock, Link2 } from 'lucide-react';

interface CardDisplayProps {
    card: Card;
    selected?: boolean;
    selectable?: boolean;
    onClick?: () => void;
    compact?: boolean;
}

export const CardDisplay = React.memo(function CardDisplay({
    card,
    selected = false,
    selectable = false,
    onClick,
    compact = false,
}: CardDisplayProps) {
    const rarityName = RARITY_NAMES[card.rarity] || 'Unknown';
    const elementColor = ELEMENT_COLORS[card.element] || '#6366f1';
    const elementIcon = ELEMENT_ICONS[card.element] || '✨';

    return (
        <div
            onClick={selectable ? onClick : undefined}
            className={clsx(
                'card-3d group relative overflow-hidden rounded-2xl transition-all duration-300',
                `rarity-border-${card.rarity}`,
                selectable && 'cursor-pointer',
                selected && 'ring-2 ring-accent-primary ring-offset-2 ring-offset-dark-900 scale-[1.02]',
                !compact ? 'p-4' : 'p-3',
                'bg-dark-600/80 backdrop-blur-sm hover:bg-dark-500/80'
            )}
        >
            {/* Rarity gradient overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    background: `radial-gradient(circle at top right, ${elementColor}, transparent 70%)`,
                }}
            />

            {/* Top section: element + rarity */}
            <div className="relative flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{elementIcon}</span>
                    <span
                        className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: `${elementColor}15`,
                            color: elementColor,
                            border: `1px solid ${elementColor}30`,
                        }}
                    >
                        {card.element}
                    </span>
                </div>
                <span
                    className={clsx(
                        'text-xs font-bold uppercase tracking-wider',
                        card.rarity === 1 && 'text-gray-400',
                        card.rarity === 2 && 'text-blue-400',
                        card.rarity === 3 && 'text-purple-400',
                        card.rarity === 4 && 'text-gradient-gold'
                    )}
                >
                    {rarityName}
                </span>
            </div>

            {/* Card image */}
            <div
                className="relative w-full aspect-[3/4] rounded-xl mb-3 flex items-center justify-center overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${elementColor}10 0%, ${elementColor}05 50%, transparent 100%)`,
                    border: `1px solid ${elementColor}15`,
                }}
            >
                {card.imageURI ? (
                    <img
                        src={card.imageURI}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }}
                    />
                ) : null}
                <span
                    className="text-5xl opacity-60"
                    style={{ display: card.imageURI ? 'none' : 'flex' }}
                >{elementIcon}</span>
                {/* Generation badge */}
                <div className="absolute top-2 right-2 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs font-bold text-slate-300">Gen {card.generation}</span>
                </div>

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {card.isLocked && (
                        <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1">
                            <Lock className="h-3 w-3 text-red-400" />
                            <span className="text-[10px] font-medium text-red-400">Locked</span>
                        </div>
                    )}
                    {card.isFused && (
                        <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-lg px-2 py-1">
                            <Link2 className="h-3 w-3 text-purple-400" />
                            <span className="text-[10px] font-medium text-purple-400">Fused</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Card name & ID */}
            <h3 className="font-display text-sm font-bold text-white mb-1 truncate">{card.name}</h3>
            <p className="text-[10px] text-slate-500 mb-3">Token #{card.tokenId.toString()}</p>

            {/* Stats */}
            {!compact && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Attack</span>
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-dark-900 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                                    style={{ width: `${Math.min((card.attack / 30) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-red-400 w-6 text-right">{card.attack}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Defense</span>
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-dark-900 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                    style={{ width: `${Math.min((card.defense / 30) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-blue-400 w-6 text-right">{card.defense}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Ability */}
            {!compact && card.ability && (
                <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[11px] text-slate-400">
                        <span className="text-accent-glow font-semibold">⚡ {card.ability}</span>
                    </p>
                </div>
            )}
        </div>
    );
});
