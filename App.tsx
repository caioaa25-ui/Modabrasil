import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Seller from './pages/Seller';

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
              <Route path="/seller" element={<Seller />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}