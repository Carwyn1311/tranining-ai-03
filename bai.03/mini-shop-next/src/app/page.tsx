'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import CategoryPills from '@/components/product/CategoryPills';

export default function HomePage() {
  const { products, isLoading } = useShop();
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
              <div className="hero-badge">
                <span className="hero-badge-sparkle">✦</span>
                <span>BỘ SƯU TẬP XUÂN HÈ 2026</span>
              </div>

              <h1 className="hero-title">
                Không gian sống <br />
                <span className="hero-title-highlight">Tối Giản &amp; Tinh Tế</span>
              </h1>
              
              <p className="hero-subtitle">
                Bộ sưu tập đồ nội thất gỗ sồi, gốm sứ trang trí &amp; đồ thủ công mỹ nghệ được chế tác tỉ mỉ từ những làng nghề truyền thống.
              </p>
              
              <Link href="/products" className="btn btn-primary hero-cta-btn">
                <span>Khám phá bộ sưu tập</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* 3 Cam kết */}
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Chất lượng 100%</h4>
                    <p>Gỗ tự nhiên &amp; gốm cao cấp</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Giao toàn quốc</h4>
                    <p>Miễn phí đơn từ 500k</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
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
              <div className="hero-floating-tag">
                <span className="hero-tag-dot"></span>
                <span>Tuyển chọn thủ công 100%</span>
              </div>
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
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <div className="section-eyebrow">DANH MỤC TUYỂN CHỌN</div>
              <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
              <p className="section-subtitle">
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
            {isLoading && products.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="product-card skeleton-card" style={{ minHeight: '300px', opacity: 0.5, background: '#f5f4f0' }} />
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="featured-bottom-cta">
            <Link href="/products" className="btn btn-outline btn-lg explore-all-btn">
              <span>Khám phá toàn bộ danh mục sản phẩm</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Brand Story Section */}
      <section id="aboutSection" className="brand-story-section">
        <div className="container brand-story-container">
          <div className="brand-story-badge">VỀ CHÚNG TÔI</div>
          <h2 className="brand-story-title">
            Nghệ Thuật Của Sự Tối Giản &amp; Mộc Mạc
          </h2>
          <p className="brand-story-desc">
            Tại <strong>Mini Shop</strong>, chúng tôi tin rằng mỗi vật dụng trong ngôi nhà không đơn thuần là đồ dùng, mà là biểu hiện của phong cách sống và tâm hồn gia chủ. Từng chiếc ghế sofa, bình gốm tráng men mờ hay giỏ mây đan đều được tuyển chọn để mang lại cảm giác bình yên và ấm áp cho không gian sống hiện đại.
          </p>

          <div className="brand-story-highlights">
            <div className="story-highlight-card">
              <div className="story-highlight-icon">✦</div>
              <h4>100% Tự Nhiên</h4>
              <p>Gỗ sồi, mây tre đan &amp; gốm thủ công</p>
            </div>
            <div className="story-highlight-card">
              <div className="story-highlight-icon">◈</div>
              <h4>Nghệ Nhân Làng Nghề</h4>
              <p>Chế tác tỉ mỉ từ nghệ nhân Việt</p>
            </div>
            <div className="story-highlight-card">
              <div className="story-highlight-icon">◆</div>
              <h4>Đổi Trả Dễ Dàng</h4>
              <p>Chính sách hoàn tiền 7 ngày an tâm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
