'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/context/ToastContext';

interface CategoryFormModalProps {
  isOpen: boolean;
  categoryToEdit?: Category | null;
  onClose: () => void;
}

const PRESET_ICONS = ['🪑', '🏺', '🧵', '💡', '🍳', '📦', '🌿', '🖼️', '🎨', '💼', '🧸', '✨'];

export default function CategoryFormModal({
  isOpen,
  categoryToEdit,
  onClose
}: CategoryFormModalProps) {
  const { addCategory, updateCategory, categories } = useShop();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '🪑'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        id: categoryToEdit.id,
        name: categoryToEdit.name,
        icon: categoryToEdit.icon || '🪑'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        icon: '🪑'
      });
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = formData.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const cleanName = formData.name.trim();

    if (!cleanId || !cleanName) {
      showToast('Vui lòng nhập đầy đủ mã định danh và tên danh mục!', 'danger');
      return;
    }

    // Check duplicate ID if adding new
    if (!categoryToEdit) {
      const exists = categories.some(c => c.id.toLowerCase() === cleanId);
      if (exists) {
        showToast(`Mã danh mục "${cleanId}" đã tồn tại! Vui lòng chọn mã khác.`, 'danger');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit.id, {
          name: cleanName,
          icon: formData.icon
        });
        showToast(`Đã cập nhật danh mục "${cleanName}" thành công!`);
      } else {
        await addCategory({
          id: cleanId,
          name: cleanName,
          icon: formData.icon
        });
        showToast(`Đã thêm mới danh mục "${cleanName}" vào hệ thống!`);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi lưu danh mục:', err);
      showToast('Có lỗi xảy ra khi lưu danh mục.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
            {categoryToEdit ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </h2>
          <button onClick={onClose} style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã định danh (Slug/ID) *</label>
            <input
              type="text"
              className="form-control"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="VD: office, garden, ceramic, toys"
              disabled={!!categoryToEdit}
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {categoryToEdit ? 'Mã định danh không thể thay đổi sau khi tạo.' : 'Dùng làm khóa liên kết trong URL và sản phẩm (chỉ chữ thường, số, dấu gạch ngang).'}
            </span>
          </div>

          <div className="form-group">
            <label>Tên hiển thị danh mục *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Văn phòng & Bàn làm việc"
              required
            />
          </div>

          <div className="form-group">
            <label>Biểu tượng (Icon)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {PRESET_ICONS.map((icon, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  style={{
                    padding: '8px 12px',
                    fontSize: '18px',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.icon === icon ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    background: formData.icon === icon ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="form-control"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Hoặc nhập emoji/icon tùy thích"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : (categoryToEdit ? 'Lưu Thay Đổi' : 'Thêm Danh Mục')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
