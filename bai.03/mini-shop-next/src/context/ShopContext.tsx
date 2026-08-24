'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Category, Order, OrderStatus, Review, Coupon } from '@/types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_ORDERS, DEFAULT_REVIEWS, DEFAULT_COUPONS } from '@/data/initialData';
import { createClient } from '@/utils/supabase/client';
import {
  mapSupabaseProduct,
  mapSupabaseCategory,
  mapSupabaseOrder,
  mapSupabaseReview,
  mapSupabaseCoupon,
  mapProductToSupabase,
  mapCategoryToSupabase,
  mapOrderToSupabase,
  mapReviewToSupabase,
  mapCouponToSupabase
} from '@/utils/supabase/mapper';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  isLoading: boolean;
  getProductById: (id: number) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addCategory: (category: Omit<Category, 'count'>) => Promise<void>;
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  addReview: (productId: number, reviewData: { userName: string; userEmail?: string; rating: number; comment: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getProductReviews: (productId: number) => Review[];
  addCoupon: (coupon: Coupon) => Promise<void>;
  updateCoupon: (code: string, updated: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Load data from Supabase
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Products
      let loadedProducts = DEFAULT_PRODUCTS;
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!prodError && prodData && prodData.length > 0) {
        loadedProducts = prodData.map(mapSupabaseProduct);
      }
      setProducts(loadedProducts);

      // 2. Fetch Categories & Calculate Dynamic Count
      let rawCats = DEFAULT_CATEGORIES;
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (!catError && catData && catData.length > 0) {
        rawCats = catData.map(mapSupabaseCategory);
      }

      const computedCats = rawCats.map(cat => {
        if (cat.id === 'all') {
          return { ...cat, count: loadedProducts.length };
        }
        const matchingCount = loadedProducts.filter(p => p.category === cat.id).length;
        return { ...cat, count: matchingCount };
      });
      setCategories(computedCats);

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

      // 4. Fetch Reviews
      const { data: revData, error: revError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!revError && revData && revData.length > 0) {
        setReviews(revData.map(mapSupabaseReview));
      } else {
        setReviews(DEFAULT_REVIEWS);
      }

      // 5. Fetch Coupons
      const { data: coupData, error: coupError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (!coupError && coupData && coupData.length > 0) {
        setCoupons(coupData.map(mapSupabaseCoupon));
      } else {
        setCoupons(DEFAULT_COUPONS);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      setCategories(DEFAULT_CATEGORIES);
      setProducts(DEFAULT_PRODUCTS);
      setOrders(DEFAULT_ORDERS);
      setReviews(DEFAULT_REVIEWS);
      setCoupons(DEFAULT_COUPONS);
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

  const getProductReviews = (productId: number) => {
    return reviews.filter(r => Number(r.productId) === Number(productId));
  };

  const addReview = async (productId: number, reviewData: { userName: string; userEmail?: string; rating: number; comment: string }) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: reviewData.userName,
      userEmail: reviewData.userEmail,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate average rating & review count for product
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prodReviews = [...reviews.filter(r => r.productId === productId), newReview];
        const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        const newCount = prodReviews.length;
        
        supabase.from('products').update({ rating: Number(avgRating.toFixed(1)), reviews_count: newCount }).eq('id', productId).then();

        return {
          ...p,
          rating: Number(avgRating.toFixed(1)),
          reviewsCount: newCount
        };
      }
      return p;
    }));

    try {
      const row = mapReviewToSupabase(newReview);
      await supabase.from('reviews').insert([row]);
    } catch (err) {
      console.error('Supabase addReview error:', err);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const target = reviews.find(r => r.id === reviewId);
    setReviews(prev => prev.filter(r => r.id !== reviewId));

    if (target) {
      // Recalculate product rating after deletion
      setProducts(prev => prev.map(p => {
        if (p.id === target.productId) {
          const remaining = reviews.filter(r => r.productId === target.productId && r.id !== reviewId);
          const avgRating = remaining.length > 0 ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length : 5.0;
          const newCount = remaining.length;
          supabase.from('products').update({ rating: Number(avgRating.toFixed(1)), reviews_count: newCount }).eq('id', target.productId).then();
          return { ...p, rating: Number(avgRating.toFixed(1)), reviewsCount: newCount };
        }
        return p;
      }));
    }

    try {
      await supabase.from('reviews').delete().eq('id', reviewId);
    } catch (err) {
      console.error('Supabase deleteReview error:', err);
    }
  };

  const addCoupon = async (couponData: Coupon) => {
    const newCoupon: Coupon = {
      ...couponData,
      code: couponData.code.toUpperCase().trim()
    };
    setCoupons(prev => [newCoupon, ...prev.filter(c => c.code !== newCoupon.code)]);

    try {
      const row = mapCouponToSupabase(newCoupon);
      await supabase.from('coupons').insert([row]);
    } catch (err) {
      console.error('Supabase addCoupon error:', err);
    }
  };

  const updateCoupon = async (code: string, updated: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, ...updated } : c));

    try {
      const row = mapCouponToSupabase({ ...updated, code });
      await supabase.from('coupons').update(row).eq('code', code);
    } catch (err) {
      console.error('Supabase updateCoupon error:', err);
    }
  };

  const deleteCoupon = async (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));

    try {
      await supabase.from('coupons').delete().eq('code', code);
    } catch (err) {
      console.error('Supabase deleteCoupon error:', err);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1;
    const newProduct: Product = {
      ...productData,
      id: newId
    };

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

  const addCategory = async (categoryData: Omit<Category, 'count'>) => {
    const newCategory: Category = {
      ...categoryData,
      count: 0
    };

    setCategories(prev => [...prev, newCategory]);

    try {
      const row = mapCategoryToSupabase(newCategory);
      const { error } = await supabase.from('categories').insert([row]);
      if (error) {
        console.error('Failed to insert category into Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase addCategory error:', err);
    }
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));

    try {
      const row = mapCategoryToSupabase({ ...updated, id });
      const { error } = await supabase.from('categories').update(row).eq('id', id);
      if (error) {
        console.error('Failed to update category in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase updateCategory error:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (id === 'all') return;

    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete category from Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase deleteCategory error:', err);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusText'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PROCESSING',
      statusText: 'Đang xử lý'
    };

    // 1. Update local & remote stock for purchased items
    orderData.items.forEach(async (item) => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.id) {
          const updatedStock = Math.max(0, p.stock - item.quantity);
          supabase.from('products').update({ stock: updatedStock }).eq('id', p.id).then();
          return { ...p, stock: updatedStock };
        }
        return p;
      }));
    });

    // 2. Save directly to Supabase orders table
    const row = mapOrderToSupabase(newOrder);
    setOrders(prev => [newOrder, ...prev]);

    try {
      const { error } = await supabase.from('orders').insert([row]);
      if (error) {
        console.error('Supabase createOrder error:', error);
      }
    } catch (e) {
      console.error('Supabase createOrder network error:', e);
    }

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
    const targetOrder = orders.find(o => o.id === orderId);

    // If order is cancelled, restore stock for its items
    if (status === 'CANCELLED' && targetOrder && targetOrder.status !== 'CANCELLED') {
      targetOrder.items.forEach(async (item) => {
        setProducts(prev => prev.map(p => {
          if (p.id === item.id) {
            const restoredStock = p.stock + item.quantity;
            supabase.from('products').update({ stock: restoredStock }).eq('id', p.id).then();
            return { ...p, stock: restoredStock };
          }
          return p;
        }));
      });
    }

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

  const cancelOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'CANCELLED');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        reviews,
        coupons,
        isLoading,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        addReview,
        deleteReview,
        getProductReviews,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        refreshData: fetchData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
