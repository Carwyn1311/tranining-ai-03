'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types';
import { formatVND } from '@/utils/format';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PROCESSING':
        return <span className="status-badge processing">● Đang xử lý</span>;
      case 'SHIPPING':
        return <span className="status-badge shipping">● Đang giao hàng</span>;
      case 'COMPLETED':
        return <span className="status-badge completed">● Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="status-badge cancelled">● Đã hủy</span>;
      default:
        return <span className="status-badge">● {status}</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '640px', width: '95%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Chi Tiết Đơn Hàng #{order.id}
              </h2>
              {getStatusBadge(order.status)}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Ngày tạo: {order.createdAt}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {/* Customer Information Box */}
        <div style={{ background: '#faf9f6', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-light)', marginBottom: '20px', fontSize: '13.5px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👤</span> Thông Tin Khách Hàng &amp; Giao Hàng
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Họ và tên: </span>
              <strong>{order.customerName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Số điện thoại: </span>
              <strong>{order.phone}</strong>
            </div>
            {order.email && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                <span>{order.email}</span>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Thanh toán: </span>
              <strong>{order.paymentMethod === 'COD' ? 'Tiền mặt khi nhận (COD)' : order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản QR' : 'Ví MoMo'}</strong>
            </div>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Địa chỉ nhận hàng: </span>
            <strong>{order.address}</strong>
          </div>
          {order.note && (
            <div style={{ marginTop: '6px', color: '#b45309' }}>
              <span>Ghi chú từ khách: </span>
              <em>&ldquo;{order.note}&rdquo;</em>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
            Danh Sách Sản Phẩm Mua ({order.items.length} món)
          </h3>
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table className="admin-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th style={{ textAlign: 'center' }}>Số lượng</th>
                  <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }} 
                        />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>x{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontSize: '13px' }}>{formatVND(item.price)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatVND(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ background: '#faf9f6', borderRadius: 'var(--radius-md)', padding: '14px 16px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
            <span>{order.shippingFee === 0 ? 'Miễn phí (Freeship)' : formatVND(order.shippingFee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
            <span>Tổng thanh toán:</span>
            <span style={{ color: 'var(--primary)', fontSize: '18px' }}>{formatVND(order.totalAmount)}</span>
          </div>
        </div>

        {/* Status Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Đổi trạng thái:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}
            >
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Hủy đơn hàng</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
