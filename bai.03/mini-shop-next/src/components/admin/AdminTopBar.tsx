'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface AdminTopBarProps {
  title: string;
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h1>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cập nhật theo thời gian thực</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="user-badge-nav" style={{ padding: '6px 14px 6px 6px' }}>
          <div className="user-avatar-mini" style={{ background: '#0284c7' }}>AD</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentUser?.name || 'Administrator'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser?.email || 'admin@minishop.vn'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-sm btn-outline"
          title="Đăng xuất khỏi Admin"
          style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
