import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Common/Layout';
import { Dashboard } from '../pages/Dashboard';
import { ClientsPage } from '../pages/Clients/ClientsPage';
import { ProductsPage } from '../pages/Products/ProductsPage';
import { OrdersPage } from '../pages/Orders/OrdersPage';
import { PaymentsPage } from '../pages/Payments/PaymentsPage';
import { PromoCodesPage } from '../pages/PromoCodes/PromoCodesPage';

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/promo-codes" element={<PromoCodesPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};
