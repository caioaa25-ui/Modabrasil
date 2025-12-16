import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/db';
import { Product } from '../types';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-40 md:h-64 bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg mb-8 flex items-center justify-center relative overflow-hidden text-white">
        <div className="z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">OFERTAS DE VERÃO</h1>
          <p className="text-sm md:text-lg opacity-90">O melhor da moda nacional com descontos imperdíveis.</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Destaques</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col">
            <div className="w-full pt-[100%] relative">
              <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-contain p-2" />
            </div>
            <div className="p-3 flex-1 flex flex-col justify-end">
              <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 h-10">{p.name}</h3>
              <div className="mt-auto">
                <span className="block text-xs text-gray-400 line-through">R$ {(p.basePrice * 1.2).toFixed(2)}</span>
                <span className="block text-lg font-medium text-gray-900">R$ {p.basePrice.toFixed(2)}</span>
                <span className="text-xs text-green-600 font-bold">10x sem juros</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}