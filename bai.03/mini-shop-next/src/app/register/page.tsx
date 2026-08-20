'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      register(name, email, phone);
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
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Đăng Ký Tài Khoản</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Tạo tài khoản để nhận ưu đãi và quản lý đơn hàng
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              className="form-control"
              placeholder="VD: Trần Hoàng Long"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="VD: hoanglong@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              className="form-control"
              placeholder="VD: 0988 777 666"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
            Tạo Tài Khoản
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Đã có tài khoản?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
