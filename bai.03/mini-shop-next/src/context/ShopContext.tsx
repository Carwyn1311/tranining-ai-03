'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Category, Order, OrderStatus } from '@/types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_ORDERS } from '@/data/initialData';
import { createClient } from '@/utils/supabase/client';
import {
  mapSupabaseProduct,
  mapSupabaseCategory,
  mapSupabaseOrder,
  mapProductToSupabase,
  mapOrderToSupabase
} from '@/utils/supabase/mapper';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  isLoading: boolean;
  getProductById: (id: number) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Load data from Supabase
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (!catError && catData && catData.length > 0) {
        setCategories(catData.map(mapSupabaseCategory));
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }

      // 2. Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!prodError && prodData && prodData.length > 0) {
        setProducts(prodData.map(mapSupabaseProduct));
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }

      // 3. Fetch Orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!orderError && orderData && orderData.length > 0) {
        setOrders(orderData.map(mapSupabaseOrder));
      } else {
        setOrders(DEFAULT_ORDERS);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fallback to local default data if network/table is unavailable
      setCategories(DEFAULT_CATEGORIES);
      setProducts(DEFAULT_PRODUCTS);
      setOrders(DEFAULT_ORDERS);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getProductById = (id: number) => {
    return products.find(p => p.id === Number(id));
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId
    };

    // Optimistic UI update
    setProducts(prev => [newProduct, ...prev]);

    try {
      const row = mapProductToSupabase(newProduct);
      const { error } = await supabase.from('products').insert([row]);
      if (error) {
        console.error('Failed to insert product into Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase addProduct error:', err);
    }
  };

  const updateProduct = async (id: number, updated: Partial<Product>) => {
    // Optimistic UI update
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));

    try {
      const row = mapProductToSupabase(updated);
      const { error } = await supabase.from('products').update(row).eq('id', id);
      if (error) {
        console.error('Failed to update product in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase updateProduct error:', err);
    }
  };

  const deleteProduct = async (id: number) => {
    // Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete product from Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase deleteProduct error:', err);
    }
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PROCESSING',
      statusText: 'Đang xử lý'
    };

    // Optimistic UI update
    setOrders(prev => [newOrder, ...prev]);

    // Async save to Supabase
    (async () => {
      try {
        const row = mapOrderToSupabase(newOrder);
        const { error } = await supabase.from('orders').insert([row]);
        if (error) {
          console.error('Failed to insert order into Supabase:', error);
        }
      } catch (err) {
        console.error('Supabase createOrder error:', err);
      }
    })();

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };

    const statusText = statusMap[status] || status;

    // Optimistic UI update
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, statusText } : o))
    );

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, status_text: statusText })
        .eq('id', orderId);
      if (error) {
        console.error('Failed to update order status in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase updateOrderStatus error:', err);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        isLoading,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        refreshData: fetchData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
