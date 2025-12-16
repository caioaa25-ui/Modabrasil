import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Sua sacola está vazia</h2>
        <p className="text-gray-500 mb-8">Que tal dar uma olhada nas novidades?</p>
        <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-dark">Sacola de Compras</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.cartId} className="p-4 sm:p-6 flex items-center">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">R$ {item.basePrice.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Cor: {item.selectedColor} | Tam: {item.selectedSize}
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qtd: {item.quantity}</p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartId)}
                    className="font-medium text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Subtotal</p>
          <p>R$ {total.toFixed(2).replace('.', ',')}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 mb-6">
          Frete e taxas calculados no checkout.
        </p>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition"
        >
          Finalizar Compra <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}