'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Không hiển thị Footer ở trang admin
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer" id="footerContact">
      <div className="container">
        <div className="footer-grid">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: '14px' }}>
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" strokeWidth="2" fill="none" />
              </svg>
              <span style={{ fontSize: '20px' }}>Mini Shop</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Không gian mua sắm nội thất, đồ gốm mỹ nghệ và đồ thủ công tinh tuyển mang phong cách sống tối giản và ấm cúng.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="#" className="action-icon-btn" title="Facebook" style={{ width: '34px', height: '34px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="action-icon-btn" title="Instagram" style={{ width: '34px', height: '34px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="footer-col">
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
              Khám Phá
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-body)' }}>
              <li><Link href="/" className="nav-link">Trang chủ</Link></li>
              <li><Link href="/products" className="nav-link">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?category=furniture" className="nav-link">Nội thất gia đình</Link></li>
              <li><Link href="/products?category=decor" className="nav-link">Đồ gốm mỹ nghệ</Link></li>
              <li><Link href="/products?category=craft" className="nav-link">Đồ thủ công mỹ nghệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="footer-col">
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
              Hỗ Trợ Khách Hàng
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-body)' }}>
              <li><Link href="/cart" className="nav-link">Giỏ hàng của bạn</Link></li>
              <li><Link href="/wishlist" className="nav-link">Danh sách yêu thích</Link></li>
              <li><a href="#" className="nav-link">Chính sách vận chuyển</a></li>
              <li><a href="#" className="nav-link">Chính sách đổi trả 7 ngày</a></li>
              <li><a href="#" className="nav-link">Hướng dẫn thanh toán</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="footer-col">
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
              Liên Hệ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: 'var(--text-body)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Tòa nhà Sao Việt, TP. Hồ Chí Minh & Hà Nội</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>0903 015 288 (Hotline 24/7)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>contact@minishop.vn</span>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
          <div>© 2026 Mini Shop. Bản quyền thuộc về Tin Học Sao Việt.</div>
          <div>Bản chuyển đổi Next.js App Router</div>
        </div>
      </div>
    </footer>
  );
}
