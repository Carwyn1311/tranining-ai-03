'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import CategoryPills from '@/components/product/CategoryPills';

export default function HomePage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products by selected category pill
  const filteredProducts = selectedCategory === 'all'
    ? products.slice(0, 6)
    : products.filter(p => p.category === selectedCategory).slice(0, 6);

  return (
    <div className="home-page">
      {/* 1. Hero Banner Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-banner-card">
            
            {/* Left Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                Không gian sống <br />
                <span style={{ color: 'var(--primary)' }}>Tối Giản & Tinh Tế</span>
              </h1>
              <p className="hero-subtitle">
                Bộ sưu tập đồ nội thất gỗ sồi, gốm sứ trang trí & đồ thủ công mỹ nghệ được chế tác tỉ mỉ từ những làng nghề truyền thống.
              </p>
              
              <Link href="/products" className="btn btn-primary hero-cta-btn">
                Khám phá bộ sưu tập &rarr;
              </Link>

              {/* 3 Cam kết */}
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Chất lượng 100%</h4>
                    <p>Gỗ tự nhiên & gốm cao cấp</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Giao toàn quốc</h4>
                    <p>Miễn phí từ 500k</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Đổi trả 7 ngày</h4>
                    <p>An tâm mua sắm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="hero-image-wrap">
              <img
                src="/MiniShop_Assets/assets/images/banner/banner-trang-chu-mini-shop.webp"
                alt="Nội thất tối giản phong cách Bắc Âu"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Category Pills Bar */}
      <CategoryPills
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. Featured Products Grid */}
      <section className="featured-products-section" style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Những món đồ nội thất và decor được ưa chuộng nhất tuần này
              </p>
            </div>
            <Link href="/products" className="section-link">
              <span>Xem tất cả {products.length} sản phẩm</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link href="/products" className="btn btn-outline btn-lg" style={{ minWidth: '220px' }}>
              Khám phá toàn bộ danh mục sản phẩm &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Brand Story Section */}
      <section id="aboutSection" style={{ padding: '60px 0', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Về Chúng Tôi
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', margin: '12px 0 16px' }}>
            Nghệ Thuật Của Sự Tối Giản & Mộc Mạc
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '24px' }}>
            Tại <strong>Mini Shop</strong>, chúng tôi tin rằng mỗi vật dụng trong ngôi nhà không đơn thuần là đồ dùng, mà là biểu hiện của phong cách sống và tâm hồn gia chủ. Từng chiếc ghế sofa, bình gốm tráng men mờ hay giỏ mây đan đều được tuyển chọn để mang lại cảm giác bình yên và ấm áp cho không gian sống hiện đại.
          </p>
        </div>
      </section>
    </div>
  );
}
