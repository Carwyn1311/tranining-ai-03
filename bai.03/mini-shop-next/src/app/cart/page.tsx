'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import QuantitySelector from '@/components/product/QuantitySelector';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    discountRate,
    discountAmount,
    totalAmount,
    applyCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  return (
    <div className="cart-page">
      <Breadcrumb items={[{ label: 'Giỏ hàng của bạn' }]} />

      <div className="container">
        {items.length > 0 ? (
          <div className="cart-layout-grid">
            
            {/* Left: Cart Items Table Card */}
            <div className="cart-items-card">
              <div className="cart-items-header">
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Giỏ Hàng Của Bạn</h1>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Có <strong>{items.length}</strong> loại sản phẩm trong giỏ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="btn btn-sm btn-outline"
                  style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-light)' }}
                >
                  Xóa tất cả
                </button>
              </div>

              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-product-cell">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-product-thumb"
                          />
                          <div>
                            <Link href={`/products/${item.id}`} style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                              {item.name}
                            </Link>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {item.categoryName || 'Sản phẩm'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatVND(item.price)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                        {formatVND(item.price * item.quantity)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: 'var(--text-light)', padding: '6px' }}
                          title="Xóa món này"
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/products" className="btn btn-outline">
                  &larr; Tiếp tục chọn thêm món khác
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="order-summary-card">
              <h2 className="summary-title">Tóm Tắt Đơn Hàng</h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Mã giảm giá (MINISHOP10)"
                  className="form-control"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '0 16px' }}>
                  Áp dụng
                </button>
              </form>

              {/* Cost Rows */}
              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                <span style={{ fontWeight: 600 }}>{formatVND(subtotal)}</span>
              </div>

              {discountRate > 0 && (
                <div className="summary-row" style={{ color: 'var(--primary)' }}>
                  <span>Giảm giá khuyến mãi ({discountRate * 100}%):</span>
                  <span style={{ fontWeight: 700 }}>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--primary)' : 'var(--text-main)' }}>
                  {shippingFee === 0 ? 'Miễn phí vận chuyển' : formatVND(shippingFee)}
                </span>
              </div>

              <div className="summary-row total-row">
                <span>Tổng thanh toán:</span>
                <span className="total-amount">{formatVND(totalAmount)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Tiến hành thanh toán &rarr;
              </Link>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                🔒 Thanh toán bảo mật chuẩn SSL 256-bit
              </div>
            </div>

          </div>
        ) : (
          <EmptyState
            title="Giỏ hàng của bạn đang trống"
            description="Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá những món đồ trang trí và nội thất tinh tế của chúng tôi ngay hôm nay!"
            actionText="Khám phá sản phẩm ngay"
            actionHref="/products"
          />
        )}
      </div>
    </div>
  );
}
