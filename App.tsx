import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import CustomerOrders from './pages/CustomerOrders';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ROTAS DA LOJA - DENTRO DO LAYOUT (Com Cabeçalho Amarelo e Menu) */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/orders" element={<CustomerOrders />} />
                  {/* Redirecionar qualquer outra URL para a home */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;