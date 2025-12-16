import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('moda-brasil-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('moda-brasil-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, color: string) => {
    const newItem: CartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}`,
      selectedSize: size,
      selectedColor: color,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setItems(items.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.basePrice, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);