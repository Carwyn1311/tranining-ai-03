'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const user = login(email);
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  const handleQuickLogin = (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      setEmail('admin@minishop.vn');
      setPassword('admin123');
      login('admin@minishop.vn', 'ADMIN');
      router.push('/admin');
    } else {
      setEmail('user@minishop.vn');
      setPassword('user123');
      login('user@minishop.vn', 'CUSTOMER');
      router.push('/');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="brand-logo" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" strokeWidth="2" fill="none" />
            </svg>
            <span>Mini Shop</span>
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Đăng Nhập</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Chào mừng bạn quay trở lại với Mini Shop
          </p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Địa chỉ Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="VD: user@minishop.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
            Đăng Nhập
          </button>
        </form>

        {/* 1-Click Fast Test Login */}
        <div className="demo-accounts-box">
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textAlign: 'center' }}>
            ⚡ 1-Click Đăng nhập thử nghiệm:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '12px' }}
            >
              👤 Khách Hàng
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="btn btn-sm btn-admin"
              style={{ fontSize: '12px' }}
            >
              🛡️ Quản Trị Viên
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
