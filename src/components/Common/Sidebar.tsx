import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/' },
    { name: 'Clients', path: '/clients' },
    { name: 'Produits', path: '/products' },
    { name: 'Commandes', path: '/orders' },
    { name: 'Paiements', path: '/payments' },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-8">SmartShop</h1>
                <nav>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`block px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-primary-600 text-white'
                                            : 'hover:bg-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
