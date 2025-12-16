import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (p: Product, s: string, c: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const s = localStorage.getItem('moda-brasil-cart');
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => localStorage.setItem('moda-brasil-cart', JSON.stringify(items)), [items]);

  const addToCart = (product: Product, size: string, color: string) => {
    setItems([...items, { ...product, cartId: Date.now().toString(), selectedSize: size, selectedColor: color, quantity: 1 }]);
  };

  const removeFromCart = (id: string) => setItems(items.filter(i => i.cartId !== id));
  const clearCart = () => setItems([]);
  const total = items.reduce((acc, i) => acc + i.basePrice, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);