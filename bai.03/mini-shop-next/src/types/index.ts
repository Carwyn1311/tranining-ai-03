export interface ProductSpecs {
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  origin?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  shortDesc: string;
  description: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  specs?: ProductSpecs;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryName?: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  statusText: string;
  paymentMethod: string;
  createdAt: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}
