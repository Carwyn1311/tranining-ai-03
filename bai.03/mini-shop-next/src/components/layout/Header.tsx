'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Nếu đang ở trang admin, không render header này (trang admin có header riêng)
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        
        {/* Brand Logo */}
        <Link href="/" className="brand-logo">
          <svg viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" strokeWidth="2" fill="none" />
          </svg>
          <span>Mini Shop</span>
        </Link>

        {/* Navigation Links */}
        <nav className="main-nav" aria-label="Menu chính">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Trang chủ
          </Link>
          <Link href="/products" className={`nav-link ${pathname.startsWith('/products') ? 'active' : ''}`}>
            Sản phẩm
          </Link>
          <Link href="/orders" className={`nav-link ${pathname.startsWith('/orders') ? 'active' : ''}`}>
            Đơn hàng
          </Link>
          <Link href="/#aboutSection" className="nav-link">
            Giới thiệu
          </Link>
          <Link href="/#footerContact" className="nav-link">
            Liên hệ
          </Link>
        </nav>

        {/* Search Bar in Header */}
        <div className="header-search">
          <form onSubmit={handleSearchSubmit} className="search-input-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="search-btn" title="Tìm kiếm">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>

        {/* Header Actions: Wishlist, Cart & Auth */}
        <div className="header-actions">
          {/* Wishlist */}
          <Link href="/wishlist" className="action-icon-btn" title="Danh sách yêu thích">
            <svg viewBox="0 0 24 24" fill={pathname === '/wishlist' ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="action-badge red">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="action-icon-btn" title="Giỏ hàng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalCount > 0 && (
              <span className="action-badge">{totalCount}</span>
            )}
          </Link>

          {/* User Auth Buttons */}
          <div className="auth-buttons">
            {currentUser ? (
              <>
                <div className="user-badge-nav">
                  <div className="user-avatar-mini">{currentUser.name.charAt(0).toUpperCase()}</div>
                  <span>{currentUser.name.split(' ').slice(-1)[0]}</span>
                </div>
                {currentUser.role === 'ADMIN' && (
                  <Link href="/admin" className="btn btn-sm btn-admin">
                    Quản trị
                  </Link>
                )}
                <button onClick={logout} className="btn btn-sm btn-outline" title="Đăng xuất">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-sm btn-outline">
                  Login
                </Link>
                <Link href="/register" className="btn btn-sm btn-blue">
                  Register
                </Link>
                <Link href="/admin" className="btn btn-sm btn-admin">
                  Admin
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
