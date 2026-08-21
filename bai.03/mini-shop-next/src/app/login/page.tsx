'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const errorParam = searchParams.get('error') || '';

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === 'unauthorized'
      ? '⚠️ Bạn cần đăng nhập bằng tài khoản Quản trị viên (Admin) để truy cập trang này.'
      : null
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await login(email.trim(), password);
      if (user.role === 'ADMIN') {
        router.push(redirectPath || '/admin');
      } else {
        if (redirectPath.startsWith('/admin')) {
          router.push('/');
        } else {
          router.push(redirectPath || '/');
        }
      }
    } catch (err: any) {
      console.error('Đăng nhập lỗi:', err);
      setErrorMessage(err?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsSubmitting(false);
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

        {errorMessage && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px', lineHeight: 1.4 }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Địa chỉ Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="VD: admin@minishop.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Demo Accounts Quick Box */}
        <div className="demo-accounts-box">
          <div className="demo-accounts-title">⚡ Chọn tài khoản test nhanh:</div>
          <div className="demo-btns-grid">
            <button
              type="button"
              className="btn-quick-fill"
              onClick={() => {
                setEmail('user@minishop.vn');
                setPassword('123456');
                setErrorMessage(null);
              }}
            >
              👤 Khách hàng (User)
            </button>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={() => {
                setEmail('admin@minishop.vn');
                setPassword('admin123');
                setErrorMessage(null);
              }}
            >
              🛡️ Quản trị viên (Admin)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Đang tải trang đăng nhập...</div>}>
      <LoginContent />
    </Suspense>
  );
}
