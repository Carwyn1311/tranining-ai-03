'use client';

import React from 'react';
import Link from 'next/link';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({
  currentTab,
  onSelectTab,
  isOpen = true,
  onToggle
}: AdminSidebarProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan (Dashboard)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: 'categories',
      label: 'Quản lý danh mục',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'coupons',
      label: 'Quản lý mã giảm giá',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      )
    },
    {
      id: 'reviews',
      label: 'Quản lý đánh giá',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: 'users',
      label: 'Quản lý tài khoản',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className={`admin-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
      />

      <aside className={`admin-sidebar ${!isOpen ? 'collapsed' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '0 4px 18px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" className="brand-logo" style={{ fontSize: '19px' }}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" strokeWidth="2" fill="none" />
              </svg>
              <span>MiniShop Admin</span>
            </Link>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Hệ thống quản trị 6 thực thể
            </span>
          </div>

          {/* Toggle button inside sidebar */}
          <button
            type="button"
            onClick={onToggle}
            title="Ẩn Sidebar"
            aria-label="Ẩn Sidebar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Nav list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                // On small mobile, close sidebar after selecting
                if (window.innerWidth <= 1024 && onToggle) {
                  onToggle();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: currentTab === item.id ? 'var(--primary)' : 'var(--text-body)',
                background: currentTab === item.id ? 'var(--primary-light)' : 'transparent',
                textAlign: 'left',
                transition: 'var(--transition)',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Return link */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Về trang bán hàng</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
