'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { formatVND } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, discountAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const { createOrder } = useShop();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    customerName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'MOMO'>('COD');
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync user profile when available
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        email: prev.email || currentUser.email || '',
        address: prev.address || currentUser.address || ''
      }));
    }
  }, [currentUser]);

  if (items.length === 0 && !createdOrderCode) {
    return (
      <div className="checkout-page">
        <Breadcrumb items={[{ label: 'Thanh toán' }]} />
        <div className="container">
          <EmptyState
            title="Không có sản phẩm nào để thanh toán"
            description="Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán."
            actionText="Xem danh sách sản phẩm"
            actionHref="/products"
          />
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newOrder = await createOrder({
        userId: currentUser ? String(currentUser.id) : undefined,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        note: formData.note,
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        totalAmount,
        shippingFee,
        discountAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod
      });

      clearCart();
      setCreatedOrderCode(newOrder.id);
    } catch (err: any) {
      console.error('Lỗi khi đặt hàng:', err);
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi lưu đơn hàng vào kho. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page" style={{ paddingBottom: '80px' }}>
      <Breadcrumb
        items={[
          { label: 'Giỏ hàng', href: '/cart' },
          { label: 'Thanh toán & Đặt hàng' }
        ]}
      />

      <div className="container">
        {/* Success Modal */}
        {createdOrderCode && (
          <div className="modal-backdrop">
            <div className="modal-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Đặt Hàng Thành Công!
              </h2>

              <p style={{ fontSize: '14px', color: 'var(--text-body)', marginBottom: '12px' }}>
                Cảm ơn bạn đã tin tưởng mua sắm tại Mini Shop. Đơn hàng đã được ghi nhận vào hệ thống kho.
              </p>

              <div style={{ background: 'var(--bg-page)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: '14px', margin: '16px 0', fontSize: '14px', textAlign: 'left' }}>
                <div>Mã đơn hàng: <strong style={{ color: 'var(--primary)' }}>#{createdOrderCode}</strong></div>
                <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '4px' }}>
                  Tổng thanh toán: <strong>{formatVND(totalAmount)}</strong>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Phương thức: <strong>{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản VietQR' : 'Ví MoMo'}</strong>
                </div>
              </div>

              {/* VietQR instructions if bank transfer */}
              {paymentMethod === 'BANK_TRANSFER' && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Quét mã VietQR để thanh toán nhanh 24/7
                  </div>
                  <img
                    src={`https://img.vietqr.io/image/MB-0933108888-compact2.png?amount=${totalAmount}&addInfo=${createdOrderCode}`}
                    alt="VietQR Payment"
                    style={{ width: '190px', height: '190px', borderRadius: '8px', border: '1px solid #cbd5e1', margin: '0 auto 8px', display: 'block' }}
                  />
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Ngân hàng Quân Đội (MB Bank) - STK: <strong>0933108888</strong><br />
                    Chủ TK: <strong>CONG TY DAO TAO TIN HOC SAO VIET</strong>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Chúng tôi sẽ liên hệ số điện thoại <strong>{formData.phone}</strong> để xác nhận và điều phối giao hàng.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/orders" className="btn btn-primary">
                  📦 Xem đơn hàng của tôi
                </Link>
                <Link href="/products" className="btn btn-outline">
                  Tiếp tục mua hàng
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="checkout-layout-grid">
          
          {/* Left: Customer Info Form */}
          <div className="checkout-form-card">
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              1. Thông Tin Giao Hàng
            </h2>

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13.5px' }}>
                {errorMessage}
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Họ và tên người nhận *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Nguyễn Văn An"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="VD: 0912 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ Email (để nhận hóa đơn điện tử)</label>
              <input
                type="email"
                className="form-control"
                placeholder="VD: nguyenvanan@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ nhận hàng chi tiết *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '28px 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              2. Phương Thức Thanh Toán
            </h2>

            <div className="payment-methods-grid">
              <label
                className={`payment-method-label ${paymentMethod === 'COD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('COD')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Thanh toán khi nhận hàng (COD)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm</div>
                </div>
              </label>

              <label
                className={`payment-method-label ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Chuyển khoản Ngân hàng (VietQR 24/7)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quét mã QR qua ứng dụng ngân hàng, xác nhận tức thì</div>
                </div>
              </label>

              <label
                className={`payment-method-label ${paymentMethod === 'MOMO' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('MOMO')}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'MOMO'}
                  onChange={() => setPaymentMethod('MOMO')}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Ví điện tử MoMo</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thanh toán qua ví điện tử MoMo siêu tiện lợi</div>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="order-summary-card">
            <h2 className="summary-title">Đơn Hàng ({items.length} món)</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>SL: {item.quantity} x {formatVND(item.price)}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {formatVND(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

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
              <span style={{ fontWeight: 600 }}>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
            </div>

            <div className="summary-total-divider" />

            <div className="summary-row summary-total-row">
              <span style={{ fontSize: '16px', fontWeight: 800 }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)' }}>
                {formatVND(totalAmount)}
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '20px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý đặt hàng...' : 'Xác Nhận Đặt Hàng'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
