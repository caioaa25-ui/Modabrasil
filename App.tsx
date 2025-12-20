import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Product } from './types';

const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'product' | 'cart'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigateToProduct = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onProductClick={navigateToProduct} />;
      case 'auth':
        return <Auth onBack={() => setCurrentPage('home')} />;
      case 'product':
        return selectedProduct ? (
          <ProductDetails product={selectedProduct} onBack={() => setCurrentPage('home')} />
        ) : <Home onProductClick={navigateToProduct} />;
      case 'cart':
        return <Cart onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onProductClick={navigateToProduct} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Layout 
          onNavigate={(page) => setCurrentPage(page)} 
          currentCount={0} // O Layout agora pega do contexto
        >
          {renderPage()}
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;