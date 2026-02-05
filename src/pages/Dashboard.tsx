import React from 'react';

import { useState, useEffect } from 'react';
import { productService } from '../services/ProductService';
import { clientService } from '../services/ClientService';
import { orderService } from '../services/OrderService';
import { paymentService } from '../services/PaymentService';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        clients: 0,
        products: 0,
        orders: 0,
        payments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [products, clients, orders, payments] = await Promise.all([
                    productService.getAllActiveProducts(),
                    clientService.getAllActiveClients(),
                    orderService.getAllOrders(),
                    paymentService.getAllPayments()
                ]);

                setStats({
                    clients: clients.totalElements,
                    products: products.totalElements,
                    orders: orders.totalElements,
                    payments: payments.totalElements,
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Carte Clients */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Clients</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                {loading ? '--' : stats.clients}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Carte Produits */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Produits</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                {loading ? '--' : stats.products}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Carte Commandes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Commandes</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                {loading ? '--' : stats.orders}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Carte Paiements */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Paiements</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                {loading ? '--' : stats.payments}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenue sur SmartShop Dashboard</h2>
                <p className="text-gray-600">
                    Gérez vos clients, produits, commandes et paiements depuis cette interface.
                </p>
            </div>
        </div>
    );
};
