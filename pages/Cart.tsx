import React from 'react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onBack: () => void;
}

export const Cart: React.FC<CartProps> = ({ onBack }) => {
  const { cart, removeFromCart, total } = useCart();

  return (
    <div className="container mx-auto px-4 py-12 fade-in max-w-5xl">
      <h2 className="text-4xl font-serif italic mb-12 text-center">Sua Sacola</h2>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-200">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">Sua sacola está vazia.</p>
          <button 
            onClick={onBack}
            className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition"
          >
            Continuar Comprando
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 border-b border-gray-100 pb-8">
                <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                  <img src={item.images[0]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Tamanho: {item.selectedSize}</p>
                    <p className="text-sm font-bold">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-[10px] text-gray-400 uppercase font-bold tracking-widest self-start hover:text-red-500 transition"
                  >
                    Remover
                  </button>
                </div>
                <div className="text-sm font-bold">
                  Qtd: {item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white p-8 border border-gray-100 h-fit sticky top-24 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-black pb-4">Resumo</h4>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frete</span>
                <span className="text-green-600 uppercase text-[10px] font-bold tracking-widest">Grátis</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-8 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition shadow-xl">
              Finalizar Pedido
            </button>
            <p className="text-[9px] text-gray-400 mt-6 text-center leading-relaxed">
              Pagamento processado de forma segura via criptografia de ponta a ponta.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};