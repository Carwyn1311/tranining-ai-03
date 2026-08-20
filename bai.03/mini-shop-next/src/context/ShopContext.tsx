'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Order, OrderStatus } from '@/types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_ORDERS } from '@/data/initialData';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  getProductById: (id: number) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem('minishop_next_products');
      if (storedProds) setProducts(JSON.parse(storedProds));

      const storedOrders = localStorage.getItem('minishop_next_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error('Failed to load shop data from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('minishop_next_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('minishop_next_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders, isLoaded]);

  const getProductById = (id: number) => {
    return products.find(p => p.id === Number(id));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PROCESSING',
      statusText: 'Đang xử lý'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, statusText: statusMap[status] || status }
          : o
      )
    );
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
