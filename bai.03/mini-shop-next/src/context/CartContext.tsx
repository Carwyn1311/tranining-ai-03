'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { DEFAULT_COUPONS } from '@/data/initialData';
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
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('minishop_next_cart');
      if (storedCart) setItems(JSON.parse(storedCart));
      const storedCoupon = localStorage.getItem('minishop_applied_coupon');
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon));
    } catch (e) {
      console.error('Failed to load cart from storage', e);
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

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem('minishop_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('minishop_applied_coupon');
      }
    } catch (e) {}
  }, [appliedCoupon, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast(`Sản phẩm <strong>${product.name}</strong> hiện đã hết hàng!`, 'danger');
      return;
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const targetQty = currentQty + quantity;

      if (product.stock !== undefined && targetQty > product.stock) {
        showToast(`Kho chỉ còn <strong>${product.stock}</strong> sản phẩm <strong>${product.name}</strong>!`, 'danger');
        if (existing) {
          return prev.map(i => i.id === product.id ? { ...i, quantity: product.stock } : i);
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            categoryName: product.categoryName,
            quantity: product.stock
          }
        ];
      }

      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: targetQty } : i
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
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = DEFAULT_COUPONS.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      showToast('Mã ưu đãi không hợp lệ! Hãy thử "SAOVIET20", "MINI10", hoặc "FREESHIP"', 'danger');
      return false;
    }

    const currentSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (found.minOrderValue && currentSubtotal < found.minOrderValue) {
      showToast(`Mã này chỉ áp dụng cho đơn hàng từ ${found.minOrderValue.toLocaleString('vi-VN')}đ trở lên!`, 'danger');
      return false;
    }

    setAppliedCoupon(found);
    showToast(`Áp dụng mã <strong>${found.code}</strong> thành công: ${found.description}!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Đã hủy bỏ mã giảm giá.');
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Standard shipping logic
  let baseShipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  if (appliedCoupon?.code === 'FREESHIP' && subtotal >= (appliedCoupon.minOrderValue || 0)) {
    baseShipping = 0;
  }
  const shippingFee = baseShipping;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.discountPercent > 0) {
    const rawDiscount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    discountAmount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
  }

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
        discountAmount,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
