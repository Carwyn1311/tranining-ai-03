'use client';

import React, { useState, useEffect } from 'react';
import { Coupon } from '@/types';
import { useToast } from '@/context/ToastContext';

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCoupon: Coupon | null;
  onSave: (couponData: Coupon) => Promise<void>;
}

export default function CouponFormModal({
  isOpen,
  onClose,
  editingCoupon,
  onSave
}: CouponFormModalProps) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Coupon>({
    code: '',
    discountPercent: 10,
    maxDiscount: 100000,
    minOrderValue: 200000,
    description: '',
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCoupon) {
      setFormData(editingCoupon);
    } else {
      setFormData({
        code: '',
        discountPercent: 10,
        maxDiscount: 100000,
        minOrderValue: 200000,
        description: '',
        isActive: true
      });
    }
  }, [editingCoupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast('Vui lòng nhập mã Voucher!', 'danger');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        code: formData.code.trim().toUpperCase()
      });
      showToast(editingCoupon ? 'Cập nhật mã giảm giá thành công!' : 'Tạo mã giảm giá mới thành công!');
      onClose();
    } catch (err: any) {
      showToast('Không thể lưu mã giảm giá: ' + (err?.message || 'Lỗi không xác định'), 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {editingCoupon ? `Sửa Mã Giảm Giá: ${editingCoupon.code}` : 'Thêm Mã Giảm Giá Mới'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Coupon Code */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              Mã Voucher (In hoa) *
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="VD: SAOVIET20, SUMMER10..."
              disabled={!!editingCoupon}
              required
            />
          </div>

          {/* Discount Percent & Max Discount */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                % Giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-control"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0% = Miễn phí ship</span>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                Giảm tối đa (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                className="form-control"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="VD: 500000"
              />
            </div>
          </div>

          {/* Min Order Value */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              className="form-control"
              value={formData.minOrderValue || ''}
              onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="VD: 300000"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              Mô tả khuyến mãi
            </label>
            <textarea
              rows={2}
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="VD: Giảm 20% tối đa 500k cho đơn từ 500k"
            />
          </div>

          {/* Active Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="isActive" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
              Kích hoạt mã ưu đãi này (Khách hàng có thể sử dụng ngay)
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : editingCoupon ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
