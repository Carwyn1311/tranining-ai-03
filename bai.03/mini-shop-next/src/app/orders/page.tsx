'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatVND } from '@/utils/format';
import { OrderStatus } from '@/types';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

export default function OrdersPage() {
  const { orders } = useShop();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter orders for the user (if user logged in, match email; otherwise show all session orders)
  const userOrders = orders.filter(order => {
    if (currentUser?.email) {
      // Match by email if exists, or show recently placed session orders
      return !order.email || order.email.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'ADMIN';
    }
    return true;
  });

  // Apply tab & search filtering
  const displayedOrders = userOrders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch = !searchQuery.trim() || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleReorder = (order: typeof orders[0]) => {
    let count = 0;
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: '',
        categoryName: '',
        stock: 99,
        rating: 5,
        reviewsCount: 0,
        shortDesc: '',
        description: ''
      }, item.quantity);
      count += item.quantity;
    });
    showToast(`Đã thêm lại <strong>${count} món</strong> từ đơn #${order.id} vào giỏ hàng!`);
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'PROCESSING':
        return 'status-badge processing';
      case 'SHIPPING':
        return 'status-badge shipping';
      case 'COMPLETED':
        return 'status-badge completed';
      case 'CANCELLED':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="orders-page" style={{ paddingBottom: '80px' }}>
      <Breadcrumb items={[{ label: 'Lịch sử đơn hàng của tôi' }]} />

      <div className="container">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Lịch Sử Đơn Hàng
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Theo dõi tiến độ giao hàng và xem lại các đơn hàng bạn đã đặt tại Mini Shop
            </p>
          </div>
          <Link href="/products" className="btn btn-primary btn-sm">
            Tiếp tục mua sắm &rarr;
          </Link>
        </div>

        {/* Filter Tabs & Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'ALL', label: 'Tất cả đơn' },
              { id: 'PROCESSING', label: 'Đang xử lý' },
              { id: 'SHIPPING', label: 'Đang giao hàng' },
              { id: 'COMPLETED', label: 'Đã hoàn thành' },
              { id: 'CANCELLED', label: 'Đã hủy' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: filterStatus === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  background: filterStatus === tab.id ? 'var(--primary-light)' : '#ffffff',
                  color: filterStatus === tab.id ? 'var(--primary)' : 'var(--text-body)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Tìm mã đơn hoặc tên món..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingRight: '32px', fontSize: '13px' }}
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              🔍
            </span>
          </div>
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <EmptyState
            title="Chưa tìm thấy đơn hàng nào"
            description={searchQuery || filterStatus !== 'ALL' ? 'Không có đơn hàng nào khớp với bộ lọc tìm kiếm của bạn.' : 'Bạn chưa có đơn hàng nào tại Mini Shop. Hãy khám phá và chọn cho mình sản phẩm ưng ý nhé!'}
            actionText="Khám phá sản phẩm ngay"
            actionHref="/products"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayedOrders.map(order => (
              <div 
                key={order.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div style={{ padding: '16px 20px', background: '#faf9f6', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
                      Đơn hàng #{order.id}
                    </span>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      • Ngày đặt: {order.createdAt}
                    </span>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      • Thanh toán: {order.paymentMethod === 'COD' ? 'Tiền mặt (COD)' : order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản QR' : 'Ví MoMo'}
                    </span>
                  </div>

                  <div>
                    <span className={getStatusBadgeClass(order.status)}>
                      ● {order.statusText}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    {order.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          paddingBottom: idx === order.items.length - 1 ? '0' : '14px',
                          borderBottom: idx === order.items.length - 1 ? 'none' : '1px dashed var(--border-light)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                          />
                          <div>
                            <Link href={`/products/${item.id}`} style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                              {item.name}
                            </Link>
                            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Số lượng: x{item.quantity} • Đơn giá: {formatVND(item.price)}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--primary)' }}>
                          {formatVND(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      <strong>Người nhận:</strong> {order.customerName} ({order.phone}) | <strong>Giao tới:</strong> {order.address}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Tổng thanh toán: </span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                          {formatVND(order.totalAmount)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        <span>Mua lại đơn này</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
