import { Product, Category, Order, User, Review, Coupon } from '@/types';

/**
 * Convert snake_case database rows from Supabase into application Product model
 */
export function mapSupabaseProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name,
    category: row.category || '',
    categoryName: row.category_name || '',
    price: Number(row.price || 0),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : (row.original_price ? Number(row.original_price) : undefined),
    image: row.image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    rating: Number(row.rating || 5),
    reviewsCount: Number(row.reviews_count || 0),
    shortDesc: row.short_desc || '',
    description: row.description || '',
    stock: Number(row.stock || 0),
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    badge: row.badge || undefined,
    specs: row.specs || {}
  };
}

/**
 * Convert snake_case database rows from Supabase into application Category model
 */
export function mapSupabaseCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    count: Number(row.count || 0),
    icon: row.icon || undefined
  };
}

/**
 * Convert application Category model to Supabase table row format
 */
export function mapCategoryToSupabase(category: Partial<Category> & { id: string }) {
  const row: Record<string, any> = { id: category.id };
  if (category.name !== undefined) row.name = category.name;
  if (category.count !== undefined) row.count = category.count;
  if (category.icon !== undefined) row.icon = category.icon;
  return row;
}

/**
 * Convert application Product model to Supabase table row format
 */
export function mapProductToSupabase(product: Partial<Product> & { id?: number }) {
  const row: Record<string, any> = {};
  if (product.id !== undefined) row.id = product.id;
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.categoryName !== undefined) row.category_name = product.categoryName;
  if (product.price !== undefined) row.price = product.price;
  if (product.originalPrice !== undefined) row.original_price = product.originalPrice;
  if (product.image !== undefined) row.image = product.image;
  if (product.gallery !== undefined) row.gallery = product.gallery;
  if (product.rating !== undefined) row.rating = product.rating;
  if (product.reviewsCount !== undefined) row.reviews_count = product.reviewsCount;
  if (product.shortDesc !== undefined) row.short_desc = product.shortDesc;
  if (product.description !== undefined) row.description = product.description;
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.isFeatured !== undefined) row.is_featured = product.isFeatured;
  if (product.isNew !== undefined) row.is_new = product.isNew;
  if (product.badge !== undefined) row.badge = product.badge;
  if (product.specs !== undefined) row.specs = product.specs;
  return row;
}

/**
 * Convert application Order model to Supabase table row format
 */
export function mapOrderToSupabase(order: Order) {
  return {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    email: order.email || null,
    address: order.address,
    note: order.note || null,
    items: order.items,
    total_amount: order.totalAmount,
    shipping_fee: order.shippingFee,
    status: order.status,
    status_text: order.statusText,
    payment_method: order.paymentMethod,
    created_at: new Date().toISOString()
  };
}

/**
 * Convert Supabase order row to application Order model
 */
export function mapSupabaseOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email || undefined,
    address: row.address,
    note: row.note || undefined,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    status: row.status || 'PROCESSING',
    statusText: row.status_text || 'Đang xử lý',
    paymentMethod: row.payment_method || 'COD',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16) : ''
  };
}

/**
 * Convert Supabase user / profile row to application User model
 */
export function mapSupabaseUser(row: any): User {
  return {
    id: row.id,
    name: row.name || row.full_name || (row.email ? row.email.split('@')[0] : 'Người dùng'),
    email: row.email || '',
    phone: row.phone || '',
    role: (row.role === 'ADMIN' || (row.email && row.email.toLowerCase().includes('admin'))) ? 'ADMIN' : 'CUSTOMER'
  };
}

/**
 * Convert application User model to Supabase table row format
 */
export function mapUserToSupabase(user: Partial<User> & { email: string }) {
  const row: Record<string, any> = { email: user.email };
  if (user.id !== undefined) row.id = user.id;
  if (user.name !== undefined) row.name = user.name;
  if (user.phone !== undefined) row.phone = user.phone;
  if (user.role !== undefined) row.role = user.role;
  return row;
}

/**
 * Convert Supabase review row to application Review model
 */
export function mapSupabaseReview(row: any): Review {
  return {
    id: String(row.id),
    productId: Number(row.product_id),
    userName: row.user_name || 'Khách hàng',
    userEmail: row.user_email || undefined,
    rating: Number(row.rating || 5),
    comment: row.comment || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16) : ''
  };
}

/**
 * Convert application Review model to Supabase row format
 */
export function mapReviewToSupabase(review: Review) {
  return {
    id: review.id,
    product_id: review.productId,
    user_name: review.userName,
    user_email: review.userEmail || null,
    rating: review.rating,
    comment: review.comment,
    created_at: new Date().toISOString()
  };
}

/**
 * Convert Supabase coupon row to application Coupon model
 */
export function mapSupabaseCoupon(row: any): Coupon {
  return {
    code: row.code,
    discountPercent: Number(row.discount_percent || 0),
    maxDiscount: row.max_discount ? Number(row.max_discount) : undefined,
    minOrderValue: row.min_order_value ? Number(row.min_order_value) : undefined,
    description: row.description || '',
    isActive: Boolean(row.is_active)
  };
}

