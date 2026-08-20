'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  applyCoupon: (code: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_next_cart');
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('minishop_next_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          categoryName: product.categoryName,
          quantity
        }
      ];
    });
    showToast(`Đã thêm <strong>${quantity} x ${product.name}</strong> vào giỏ hàng!`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: number) => {
    const item = items.find(i => i.id === productId);
    setItems(prev => prev.filter(i => i.id !== productId));
    if (item) {
      showToast(`Đã xóa <strong>${item.name}</strong> khỏi giỏ hàng.`);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MINISHOP10' || cleanCode === 'SALE10') {
      setDiscountRate(0.1);
      showToast('Áp dụng mã giảm giá 10% thành công!');
      return true;
    }
    showToast('Mã giảm giá không hợp lệ! Hãy thử "MINISHOP10"', 'danger');
    return false;
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const discountAmount = Math.round(subtotal * discountRate);
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        shippingFee,
        discountRate,
        discountAmount,
        totalAmount,
        applyCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
