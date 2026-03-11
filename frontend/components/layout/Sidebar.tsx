'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Merge,
    Unlink,
    BarChart3,
    ShieldCheck,
    Swords,
    Wrench,
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/combine', label: 'Combine', icon: Merge },
    { href: '/unfuse', label: 'Unfuse', icon: Unlink },
    { href: '/repair', label: 'Repair', icon: Wrench },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-dark-800/80 backdrop-blur-xl">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow-sm">
                    <Swords className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-display text-lg font-bold text-white">CardFi</h1>
                    <p className="text-xs text-slate-500">NFT Card Game</p>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="mt-6 px-3 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-accent-primary/10 text-accent-glow shadow-glow-sm border border-accent-primary/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            )}
                        >
                            <Icon className={clsx('h-5 w-5', isActive ? 'text-accent-glow' : 'text-slate-500')} />
                            {label}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-glow animate-glow-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                <div className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 text-center">Hardhat Local • Chain 31337</p>
                </div>
            </div>
        </aside>
    );
}
