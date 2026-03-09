'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
