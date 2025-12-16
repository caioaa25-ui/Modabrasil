import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MoreVertical, X, ShoppingCart, LogOut, Search, MapPin, User, Home, Package, ShoppingBag, Users, Download } from 'lucide-react';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { user, profile, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Início', path: '/', public: true, icon: <Home size={18} /> },
    { name: 'Meus Pedidos', path: '/orders', role: 'customer', icon: <Package size={18} /> },
    { name: 'Painel do Parceiro', path: '/seller', role: 'seller', icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header styled like ML - using secondary color (yellow) as base */}
      <header className="bg-secondary shadow-sm pt-2 pb-2 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* Top Row: Logo, Search, Menu Toggle */}
          <div className="flex items-center gap-4 h-12 relative">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-extrabold text-2xl tracking-tight text-dark">
                Moda<span className="text-primary">Brasil</span>
              </span>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 relative max-w-2xl">
              <input 
                type="text" 
                placeholder="Buscar produtos, marcas e muito mais..." 
                className="w-full h-10 pl-4 pr-10 rounded shadow-sm border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
              />
              <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 border-l border-gray-200">
                <Search size={20} />
              </button>
            </div>

            {/* Mobile Header Icons */}
            <div className="md:hidden flex-1 flex justify-end items-center gap-2">
               {showInstallBtn && (
                 <button onClick={handleInstallClick} className="text-dark p-2 animate-pulse" title="Instalar App">
                   <Download size={24} />
                 </button>
               )}
               <Link to="/cart" className="relative text-dark p-2">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </Link>
              
              {/* 3 Dots Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-dark p-2 focus:outline-none">
                <MoreVertical size={24} />
              </button>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-800">
              <div className="flex items-center gap-5 font-normal">
                {showInstallBtn && (
                  <button onClick={handleInstallClick} className="flex items-center gap-1 text-dark hover:bg-black/5 px-3 py-1 rounded-full transition">
                    <Download size={16} /> <span className="font-bold">Baixar o App</span>
                  </button>
                )}
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <User size={18} />
                      <span>{profile?.name?.split(' ')[0]}</span>
                    </div>
                    <Link to="/orders" className="hover:text-gray-900">Compras</Link>
                    <button onClick={handleLogout} title="Sair"><LogOut size={18} /></button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Link to="/login" className="hover:text-gray-900">Crie a sua conta</Link>
                    <Link to="/login" className="hover:text-gray-900">Entre</Link>
                  </div>
                )}
                <Link to="/cart" className="hover:text-gray-900 relative">
                   <ShoppingCart size={20} />
                   {items.length > 0 && (
                     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full">
                       {items.length}
                     </span>
                   )}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Location (Desktop) */}
          <div className="hidden md:flex justify-between items-center mt-2 text-sm text-gray-700/80">
            <div className="flex items-center gap-1 hover:border border-transparent hover:border-gray-300 rounded p-1 cursor-pointer min-w-[100px]">
              <MapPin size={18} className="text-gray-600" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gray-600">Enviar para</span>
                <span className="font-medium text-xs text-gray-800">Brasil</span>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-2 pb-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar no Moda Brasil" 
                className="w-full py-2 pl-10 pr-4 rounded bg-white text-gray-800 focus:outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (3 Dots) */}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-14 right-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden md:hidden animate-in fade-in slide-in-from-top-2">
            
            {/* User Info Header */}
            <div className="bg-primary p-4 text-white">
               {user ? (
                 <div className="flex flex-col">
                    <span className="font-bold text-lg truncate">{profile?.name || 'Usuário'}</span>
                    <span className="text-xs text-green-100">{profile?.email}</span>
                 </div>
               ) : (
                 <div className="flex flex-col gap-2">
                    <span className="font-bold text-lg">Bem-vindo</span>
                    <p className="text-xs text-green-100 mb-1">Acesse sua conta para ver suas compras</p>
                 </div>
               )}
            </div>

            <div className="py-2">
              {showInstallBtn && (
                 <button 
                   onClick={() => { handleInstallClick(); setIsMenuOpen(false); }}
                   className="w-full flex items-center gap-3 px-4 py-3 text-primary font-bold bg-green-50 hover:bg-green-100 transition"
                 >
                   <Download size={18} />
                   <span>Instalar Aplicativo</span>
                 </button>
              )}

              {navLinks.map((link) => {
                 if (!link.public && (!profile || profile.role !== link.role)) return null;
                 return (
                   <Link 
                     key={link.path} 
                     to={link.path} 
                     onClick={() => setIsMenuOpen(false)} 
                     className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                   >
                     {link.icon && <span className="text-gray-400">{link.icon}</span>}
                     <span className="font-medium">{link.name}</span>
                   </Link>
                 )
              })}

              <div className="border-t border-gray-100 my-1"></div>

              {!user ? (
                 <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-gray-50 font-bold"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    Criar conta
                  </Link>
                 </>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sair</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}