import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'auth' | 'product' | 'cart') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const { user } = useAuth();
  const { cart } = useCart();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => onNavigate('home')}
              className="text-2xl font-serif font-bold tracking-tighter cursor-pointer hover:opacity-70 transition"
            >
              MODA BRASIL
            </h1>
            <nav className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold">
              <button onClick={() => onNavigate('home')} className="hover:text-accent transition">Início</button>
              <button className="hover:text-accent transition">Feminino</button>
              <button className="hover:text-accent transition">Masculino</button>
              <button className="hover:text-accent transition">Coleções</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div 
              onClick={() => onNavigate('cart')}
              className="relative cursor-pointer group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            {user ? (
              <button className="text-xs uppercase tracking-widest font-bold border-b border-black">Conta</button>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="text-xs uppercase tracking-widest font-bold hover:text-accent transition"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black text-white py-16 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-serif font-bold mb-6">MODA BRASIL</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefinindo a elegância contemporânea com a alma e o calor do design brasileiro.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Atendimento</h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li><a href="#" className="hover:text-white transition">Meus Pedidos</a></li>
              <li><a href="#" className="hover:text-white transition">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-white transition">Fale Conosco</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Institucional</h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li><a href="#" className="hover:text-white transition">Nossa História</a></li>
              <li><a href="#" className="hover:text-white transition">Sustentabilidade</a></li>
              <li><a href="#" className="hover:text-white transition">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em]">Mantenha-se Conectado</h4>
            <p className="text-gray-400 text-xs mb-4">Receba novidades e convites exclusivos.</p>
            <div className="flex border-b border-gray-700 pb-2">
              <input 
                type="email" 
                placeholder="E-mail" 
                className="bg-transparent text-sm w-full outline-none py-1" 
              />
              <button className="text-xs font-bold uppercase tracking-widest hover:text-accent transition">Ok</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 text-[10px] uppercase tracking-widest">
          © 2024 Moda Brasil. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};