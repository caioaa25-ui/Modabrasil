import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, total } = useCart();

  if (items.length === 0) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
      <Link to="/" className="text-primary font-bold mt-4 inline-block">Ver produtos</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
      <div className="bg-white rounded shadow divide-y">
        {items.map(item => (
          <div key={item.cartId} className="p-4 flex gap-4">
            <img src={item.images[0]} className="w-20 h-20 object-contain border rounded" />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.selectedColor} | {item.selectedSize}</p>
              <p className="font-bold mt-1">R$ {item.basePrice.toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item.cartId)} className="text-red-500"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <button className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-700">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}