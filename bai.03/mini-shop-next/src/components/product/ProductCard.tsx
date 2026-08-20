'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatVND } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="product-card">
      {/* Product Image & Badges */}
      <div className="product-card-media">
        {product.badge && (
          <span className={`card-badge-top-left ${product.badge.includes('-') ? 'red' : ''}`}>
            {product.badge}
          </span>
        )}
        
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          title={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          type="button"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={wishlisted ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <Link href={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Card Body */}
      <div className="product-card-body">
        <Link href={`/products/${product.id}`}>
          <h3 className="product-card-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="product-card-price">{formatVND(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-card-original-price">{formatVND(product.originalPrice)}</span>
          )}
        </div>

        <p className="product-card-desc">
          {product.shortDesc || product.description}
        </p>

        <div className="product-card-actions">
          <Link href={`/products/${product.id}`} className="btn-card-detail">
            Xem chi tiết &rarr;
          </Link>
          <button
            onClick={() => addToCart(product, 1)}
            className="btn-card-add-cart"
            title="Thêm vào giỏ hàng"
            type="button"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
