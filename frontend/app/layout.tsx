import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';

const Providers = dynamic(
    () => import('@/lib/providers').then((mod) => mod.Providers),
    { ssr: false }
);

export const metadata: Metadata = {
    title: 'NFT Card Game | Reversible Fusion GameFi',
    description:
        'A dual-layer NFT card combination system featuring deflationary burn-and-mint and reversible fusion mechanics. Collect, combine, and strategize.',
    keywords: ['NFT', 'Card Game', 'GameFi', 'DeFi', 'Blockchain', 'Web3', 'Fusion'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-dark-900 text-slate-100 antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
