'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface AdminTopBarProps {
  title: string;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function AdminTopBar({
  title,
  isSidebarOpen = true,
  onToggleSidebar
}: AdminTopBarProps) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Thu gọn thanh điều hướng (Ẩn sidebar)' : 'Mở rộng thanh điều hướng (Hiện sidebar)'}
          aria-label="Toggle Sidebar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            background: isSidebarOpen ? '#ffffff' : 'var(--primary-light)',
            color: isSidebarOpen ? 'var(--text-main)' : 'var(--primary)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {isSidebarOpen ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <polyline points="14 9 17 12 14 15" />
            </svg>
          )}
        </button>

        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {title}
          </h1>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Hệ thống quản trị thời gian thực
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="user-badge-nav" style={{ padding: '4px 12px 4px 6px' }}>
          <div className="user-avatar-mini" style={{ background: '#0284c7' }}>AD</div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{currentUser?.name || 'Administrator'}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{currentUser?.email || 'admin@minishop.vn'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-sm btn-outline"
          title="Đăng xuất khỏi Admin"
          style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)', fontSize: '12px', padding: '6px 12px' }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
