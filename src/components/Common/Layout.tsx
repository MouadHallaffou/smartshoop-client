import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Header />
                <main className="mt-16 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
};
