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
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  const handleQuickApply = (code: string) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  return (
    <div className="cart-page" style={{ paddingBottom: '80px' }}>
      <Breadcrumb items={[{ label: 'Giỏ hàng của bạn' }]} />

      <div className="container">
        {items.length > 0 ? (
          <div className="cart-layout-grid">
            
            {/* Left: Cart Items Table Card */}
            <div className="cart-items-card">
              <div className="cart-items-header">
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Giỏ Hàng Của Bạn</h1>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Có <strong>{items.length}</strong> loại sản phẩm trong giỏ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="btn btn-sm btn-outline"
                  style={{ color: 'var(--accent-red)', borderColor: '#fecaca' }}
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
                          style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
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

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/products" className="btn btn-outline">
                  &larr; Tiếp tục chọn thêm món khác
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="order-summary-card">
              <h2 className="summary-title">Tóm Tắt Đơn Hàng</h2>

              {/* Coupon Form */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '6px' }}>
                  Mã ưu đãi / Voucher khuyến mãi:
                </label>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nhập mã (SAOVIET20, MINI10...)"
                    className="form-control"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 14px', fontSize: '13px' }}>
                    Áp dụng
                  </button>
                </form>

                {/* Quick select vouchers */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['SAOVIET20', 'MINI10', 'FREESHIP'].map(code => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleQuickApply(code)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: appliedCoupon?.code === code ? 'var(--primary-light)' : '#f3f4f6',
                        border: appliedCoupon?.code === code ? '1px solid var(--primary)' : '1px dashed #d1d5db',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: appliedCoupon?.code === code ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer'
                      }}
                    >
                      🏷️ {code}
                    </button>
                  ))}
                </div>

                {/* Applied coupon alert */}
                {appliedCoupon && (
                  <div style={{ marginTop: '12px', background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)' }}>Đã áp dụng: {appliedCoupon.code}</strong>
                      <div style={{ color: 'var(--text-body)', fontSize: '11.5px' }}>{appliedCoupon.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                      title="Hủy mã"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Rows */}
              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                <span style={{ fontWeight: 600 }}>{formatVND(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row" style={{ color: 'var(--primary)' }}>
                  <span>Khuyến mãi ({appliedCoupon?.code}):</span>
                  <span style={{ fontWeight: 700 }}>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                <span style={{ fontWeight: 600 }}>
                  {shippingFee === 0 ? (
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Miễn phí</span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>

              <div className="summary-total-divider" />

              <div className="summary-row summary-total-row">
                <span style={{ fontSize: '16px', fontWeight: 800 }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)' }}>
                  {formatVND(totalAmount)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>Tiến hành thanh toán</span>
                <span>&rarr;</span>
              </Link>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span> Bảo mật thông tin thanh toán tuyệt đối
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚚</span> Giao hàng toàn quốc từ 2-4 ngày làm việc
                </div>
              </div>
            </div>

          </div>
        ) : (
          <EmptyState
            title="Giỏ hàng của bạn đang trống"
            description="Hãy dạo qua cửa hàng và chọn những sản phẩm ưng ý nhất vào giỏ nhé!"
            actionText="Mua sắm ngay bây giờ"
            actionHref="/products"
          />
        )}
      </div>
    </div>
  );
}
