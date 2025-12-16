import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/db';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    getProducts().then(products => {
      const p = products.find(i => i.id === id);
      setProduct(p || null);
    });
  }, [id]);

  if (!product) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4 md:flex gap-8">
      <div className="md:w-2/3 flex justify-center bg-gray-50 rounded">
        <img src={product.images[0]} alt={product.name} className="max-h-[400px] object-contain" />
      </div>
      <div className="md:w-1/3 mt-6 md:mt-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <div className="text-3xl font-light text-gray-900 mb-2">R$ {product.basePrice.toFixed(2)}</div>
        <p className="text-green-600 font-medium text-sm mb-6">em 10x R$ {(product.basePrice/10).toFixed(2)} sem juros</p>

        <div className="mb-4">
          <p className="font-bold text-sm mb-2">Cor: {color}</p>
          <div className="flex gap-2">
            {product.colors.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`px-3 py-1 border rounded ${color === c ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-bold text-sm mb-2">Tamanho: {size}</p>
          <div className="flex gap-2">
            {product.sizes.map(s => (
              <button key={s} onClick={() => setSize(s)} className={`px-3 py-1 border rounded ${size === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200'}`}>{s}</button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            if(!size || !color) return alert('Selecione as opções');
            addToCart(product, size, color);
            navigate('/cart');
          }}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition mb-4"
        >
          Comprar Agora
        </button>

        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex gap-2 items-center"><Truck size={16} /> <span className="text-green-600 font-bold">Frete Grátis</span> para todo Brasil</div>
          <div className="flex gap-2 items-center"><ShieldCheck size={16} /> Compra Garantida</div>
        </div>
      </div>
    </div>
  );
}