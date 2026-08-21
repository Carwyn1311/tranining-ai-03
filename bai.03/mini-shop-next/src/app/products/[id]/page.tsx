'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatVND } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ImageGallery from '@/components/product/ImageGallery';
import QuantitySelector from '@/components/product/QuantitySelector';
import SpecsTable from '@/components/product/SpecsTable';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/ui/EmptyState';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const { getProductById, products, isLoading } = useShop();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [quantity, setQuantity] = useState(1);

  const product = getProductById(productId);

  if (isLoading && !product) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="skeleton-card" style={{ height: '420px', borderRadius: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton-card" style={{ height: '32px', width: '70%' }} />
            <div className="skeleton-card" style={{ height: '24px', width: '40%' }} />
            <div className="skeleton-card" style={{ height: '120px', width: '100%' }} />
            <div className="skeleton-card" style={{ height: '50px', width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh."
          actionText="Quay lại danh mục"
          actionHref="/products"
        />
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Related products (same category or others, max 4)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', href: '/products' },
          { label: product.categoryName, href: `/products?category=${product.category}` },
          { label: product.name }
        ]}
      />

      <div className="container">
        
        {/* Main Product Info Grid */}
        <div className="product-detail-layout">
          
          {/* 1. Left: Image Gallery */}
          <div className="detail-gallery-container">
            <ImageGallery
              mainImage={product.image}
              gallery={product.gallery}
              productName={product.name}
            />
          </div>

          {/* 2. Center: Product Info & Buy Actions */}
          <div className="detail-info-wrap">
            
            {/* Badges */}
            <div className="detail-badges-row">
              {product.stock <= 0 ? (
                <span className="stock-badge" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>
                  ● Đã hết hàng
                </span>
              ) : product.stock <= 5 ? (
                <span className="stock-badge" style={{ background: '#fffbeb', color: '#d97706', borderColor: '#fde68a' }}>
                  ⚠️ Chỉ còn {product.stock} sản phẩm trong kho
                </span>
              ) : (
                <span className="stock-badge">
                  ● Còn {product.stock} sản phẩm
                </span>
              )}
              <span className="category-tag-badge">
                {product.categoryName}
              </span>
            </div>

            {/* Title */}
            <h1 className="detail-product-title">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating-row">
              <div className="stars-wrap">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span style={{ fontWeight: 700 }}>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} đánh giá từ khách hàng)</span>
            </div>

            {/* Price */}
            <div className="detail-price-row">
              <span className="detail-current-price">{formatVND(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="detail-original-price">{formatVND(product.originalPrice)}</span>
                  <span className="detail-discount-tag">
                    Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="detail-description-text">
              {product.description}
            </p>

            {/* Quantity Selector */}
            {product.stock > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Số lượng mua:
                </span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={product.stock}
                />
              </div>
            ) : (
              <div style={{ color: '#dc2626', fontSize: '13.5px', fontWeight: 600, margin: '8px 0' }}>
                Sản phẩm tạm thời hết hàng. Vui lòng quay lại sau!
              </div>
            )}

            {/* Action Buttons */}
            <div className="detail-actions-row">
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                className={`btn-detail-add-cart ${product.stock <= 0 ? 'disabled' : ''}`}
                disabled={product.stock <= 0}
                style={product.stock <= 0 ? { opacity: 0.6, cursor: 'not-allowed', background: '#9ca3af' } : {}}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>{product.stock <= 0 ? 'Đã hết hàng' : 'Thêm vào giỏ hàng'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`btn-detail-wishlist ${wishlisted ? 'active' : ''}`}
                title={wishlisted ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{wishlisted ? 'Đã yêu thích' : 'Yêu thích'}</span>
              </button>
            </div>

            {/* Commitments Box */}
            <div style={{ background: 'var(--bg-page)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Cam kết 100% hình ảnh thật chụp từ sản phẩm thực tế</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Đổi trả miễn phí trong vòng 7 ngày nếu lỗi từ nhà sản xuất</span>
              </div>
            </div>

          </div>

          {/* 3. Right: Specs Table Sidebar */}
          <div className="detail-specs-sidebar">
            <SpecsTable specs={product.specs} />
          </div>

        </div>

        {/* 4. Related Products Section */}
        {relatedProducts.length > 0 && (
          <section style={{ margin: '60px 0 30px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
            <div className="section-header-flex">
              <h2 className="section-title">Sản Phẩm Cùng Loại & Nổi Bật</h2>
              <Link href="/products" className="section-link">
                Xem thêm &rarr;
              </Link>
            </div>

            <div className="products-grid products-grid-4">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
