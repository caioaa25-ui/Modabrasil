
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import SellerDashboard from './pages/SellerDashboard';
import Checkout from './pages/Checkout';
import CustomerOrders from './pages/CustomerOrders';
import AdminDashboard from './pages/AdminDashboard';
import AffiliateDashboard from './pages/AffiliateDashboard';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/affiliate" element={<AffiliateDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<CustomerOrders />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}
