'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useShop } from './ShopContext';

interface WishlistContextType {
  wishlistIds: number[];
  toggleWishlist: (productId: number) => boolean;
  isWishlisted: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();
  const { getProductById } = useShop();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('minishop_next_wishlist');
      if (stored) setWishlistIds(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('minishop_next_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistIds, isLoaded]);

  const toggleWishlist = (productId: number): boolean => {
    const product = getProductById(productId);
    const exists = wishlistIds.includes(productId);
    let isAdded = false;

    if (exists) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      if (product) showToast(`Đã bỏ <strong>${product.name}</strong> khỏi yêu thích.`);
      isAdded = false;
    } else {
      setWishlistIds(prev => [...prev, productId]);
      if (product) showToast(`Đã thêm <strong>${product.name}</strong> vào yêu thích!`);
      isAdded = true;
    }

    return isAdded;
  };

  const isWishlisted = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        count: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
