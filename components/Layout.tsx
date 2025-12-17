import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, Search, Menu } from 'lucide-react';
import { auth } from '../firebase';
import InstallPWA from './InstallPWA';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, profile } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detector de Vendedor (Referral System)
  useEffect(() => {
    const sellerId = searchParams.get('seller');
    if (sellerId) {
      console.log('Referral detectado:', sellerId);
      localStorage.setItem('referredSellerId', sellerId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-secondary shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-dark flex-shrink-0">
              Moda<span className="text-primary">Brasil</span>
            </Link>

            {/* Busca (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <input type="text" placeholder="Buscar produtos..." className="w-full pl-4 pr-10 py-2 rounded shadow-sm border-none outline-none" />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>

            {/* Ações */}
            <div className="flex items-center gap-4 text-sm font-medium text-dark">
              {/* Botão de Instalar (Só aparece se disponível) */}
              <div className="hidden md:block">
                 <InstallPWA />
              </div>

              <Link to="/cart" className="relative p-2">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">Olá, {profile?.name?.split(' ')[0]}</span>
                  {profile?.role === 'seller' && (
                    <Link to="/seller" className="bg-dark text-white px-3 py-1 rounded hover:bg-blue-900">Parceiro</Link>
                  )}
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Admin</Link>
                  )}
                  <button onClick={() => auth.signOut()}><LogOut size={20} /></button>
                </div>
              ) : (
                <Link to="/login" className="hover:text-primary">Entrar</Link>
              )}
            </div>
          </div>
          
          {/* Mobile Install & Search */}
          <div className="md:hidden mt-3 flex gap-2">
             <div className="relative flex-1">
               <input type="text" placeholder="Buscar..." className="w-full pl-3 pr-10 py-2 rounded shadow-sm border-none outline-none" />
               <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
             </div>
             <InstallPWA />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}