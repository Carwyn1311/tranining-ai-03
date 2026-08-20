'use client';

import React from 'react';
import Link from 'next/link';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export default function AdminSidebar({ currentTab, onSelectTab }: AdminSidebarProps) {
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
    }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div style={{ padding: '0 8px 24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
        <Link href="/" className="brand-logo" style={{ fontSize: '20px' }}>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" strokeWidth="2" fill="none" />
          </svg>
          <span>MiniShop Admin</span>
        </Link>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
          Hệ thống quản trị Next.js
        </span>
      </div>

      {/* Nav list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
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
              transition: 'var(--transition)'
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer Return link */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Về trang bán hàng</span>
        </Link>
      </div>
    </aside>
  );
}
