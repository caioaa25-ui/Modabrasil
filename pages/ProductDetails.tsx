import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold mb-12 hover:text-accent transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para a loja
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Galeria de Imagens */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            <img 
              src={product.images[0]} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="flex flex-col justify-center">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{product.name}</h1>
          <p className="text-2xl font-bold mb-8">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          
          <div className="h-[1px] bg-black/10 w-full mb-8"></div>
          
          <p className="text-gray-600 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="mb-10">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Selecione o Tamanho</h4>
            <div className="flex gap-4">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all duration-300
                    ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl
              ${added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-accent'}`}
          >
            {added ? 'Adicionado com Sucesso' : 'Adicionar ao Carrinho'}
          </button>

          <div className="mt-12 space-y-4 text-[10px] uppercase tracking-widest font-semibold text-gray-500">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Entrega Grátis acima de R$ 500,00
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Troca fácil em até 30 dias
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};