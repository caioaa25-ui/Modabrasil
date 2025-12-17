import React, { useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Search, Link as LinkIcon } from 'lucide-react';
import { auth } from '../firebase';
import { recordAffiliateClick } from '../services/db';
import InstallPWA from './InstallPWA';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, profile } = useAuth();
  const { items } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // --- LÓGICA DE RASTREAMENTO DE AFILIADO (REFORÇADA) ---
  useEffect(() => {
    // Função auxiliar para capturar o parâmetro 'ref' de qualquer lugar da URL
    const getRefCode = () => {
      // 1. Tenta pegar do React Router (QueryParams depois do #)
      if (searchParams.get('ref')) return searchParams.get('ref');

      // 2. Tenta pegar da URL nativa do navegador (Antes do #) -> ESTE É O MAIS IMPORTANTE
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('ref')) return urlParams.get('ref');

      // 3. Fallback manual regex para casos extremos
      const match = window.location.href.match(/[?&]ref=([^&#]+)/);
      if (match && match[1]) return match[1];

      return null;
    };

    const refCode = getRefCode();

    if (refCode) {
      console.log('🔗 Código de afiliado detectado:', refCode);
      // Salva no LocalStorage para persistência
      localStorage.setItem('moda_brasil_ref', refCode);
      
      // Registra o clique no banco
      recordAffiliateClick(refCode);
    }
  }, [searchParams, location]);

  // Detector de Vendedor (Referral System antigo/Lojista)
  useEffect(() => {
    const sellerId = searchParams.get('seller');
    if (sellerId) {
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
              {/* Botão de Instalar */}
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
                  
                  {/* Link para Painel de Afiliados */}
                  <Link to="/affiliate" className="text-dark hover:text-primary p-2" title="Programa de Afiliados">
                    <LinkIcon size={20} />
                  </Link>

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