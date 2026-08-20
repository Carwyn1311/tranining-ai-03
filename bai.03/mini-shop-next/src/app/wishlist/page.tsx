'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useShop } from '@/context/ShopContext';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { products } = useShop();

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="wishlist-page">
      <Breadcrumb items={[{ label: 'Danh sách yêu thích' }]} />

      <div className="container" style={{ padding: '16px 20px 60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
            Danh Sách Yêu Thích Của Bạn
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Lưu lại những món đồ bạn quan tâm để dễ dàng theo dõi và mua sắm sau này
          </p>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="products-grid products-grid-4">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Danh sách yêu thích đang trống"
            description="Bạn chưa thả tim cho sản phẩm nào. Hãy duyệt qua danh mục sản phẩm và bấm vào biểu tượng trái tim để lưu lại nhé!"
            actionText="Khám phá sản phẩm ngay"
            actionHref="/products"
            icon={(
              <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="var(--accent-red)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          />
        )}
      </div>
    </div>
  );
}
