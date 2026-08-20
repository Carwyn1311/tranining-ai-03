'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/context/ToastContext';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Sofa phòng khách (Nội thất)', value: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp' },
  { label: 'Bộ bàn ăn gỗ Sồi (Nội thất)', value: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp' },
  { label: 'Kệ gỗ trang trí (Nội thất)', value: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp' },
  { label: 'Chậu cây để bàn (Nội thất)', value: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp' },
  { label: 'Bình gốm trang trí mộc (Mỹ nghệ)', value: '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp' },
  { label: 'Bộ 3 bình gốm Minimal (Mỹ nghệ)', value: '/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp' },
  { label: 'Đèn tre thủ công (Mỹ nghệ)', value: '/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp' },
  { label: 'Đèn lồng tre (Mỹ nghệ)', value: '/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp' },
  { label: 'Giỏ mây đan thủ công (Thủ công)', value: '/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp' },
  { label: 'Tranh treo Macrame (Thủ công)', value: '/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp' },
  { label: 'Khay gỗ hoa văn khắc Laser (Thủ công)', value: '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp' },
  { label: 'Khay gỗ trang trí đa năng (Thủ công)', value: '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp' }
];

export default function ProductFormModal({
  isOpen,
  productToEdit,
  onClose
}: ProductFormModalProps) {
  const { addProduct, updateProduct, categories } = useShop();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'furniture',
    price: 0,
    originalPrice: 0,
    image: PRESET_IMAGES[0].value,
    stock: 10,
    shortDesc: '',
    description: '',
    badge: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice || 0,
        image: productToEdit.image || PRESET_IMAGES[0].value,
        stock: productToEdit.stock,
        shortDesc: productToEdit.shortDesc || '',
        description: productToEdit.description || '',
        badge: productToEdit.badge || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'furniture',
        price: 0,
        originalPrice: 0,
        image: PRESET_IMAGES[0].value,
        stock: 10,
        shortDesc: '',
        description: '',
        badge: 'Mới'
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      showToast('Vui lòng nhập đầy đủ tên và giá sản phẩm hợp lệ!', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find(c => c.id === formData.category);
      const categoryName = selectedCategory ? selectedCategory.name : 'Khác';

      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          ...formData,
          categoryName
        });
        showToast(`Đã cập nhật sản phẩm "${formData.name}" lên Supabase!`);
      } else {
        await addProduct({
          ...formData,
          categoryName,
          rating: 5.0,
          reviewsCount: 0,
          gallery: [formData.image],
          isFeatured: false,
          isNew: true
        });
        showToast(`Đã thêm mới sản phẩm "${formData.name}" vào Supabase!`);
      }
      onClose();
    } catch (err: any) {
      console.error('Lỗi lưu sản phẩm:', err);
      showToast('Có lỗi xảy ra khi lưu sản phẩm vào Supabase.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '580px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
            {productToEdit ? 'Chỉnh Sửa Sản Phẩm (Supabase)' : 'Thêm Sản Phẩm Mới (Supabase)'}
          </h2>
          <button onClick={onClose} style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Sofa 2 chỗ Scandinavian"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Danh mục</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Số lượng tồn kho</label>
              <input
                type="number"
                className="form-control"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Giá bán (VNĐ) *</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="1000"
                step="1000"
                required
              />
            </div>

            <div className="form-group">
              <label>Giá gốc gạch ngang (nếu có)</label>
              <input
                type="number"
                className="form-control"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* Preset Image Selector with Preview */}
          <div className="form-group">
            <label>Hình ảnh sản phẩm (chọn từ thư mục assets có sẵn) *</label>
            <select
              className="form-control"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            >
              {PRESET_IMAGES.map((img, idx) => (
                <option key={idx} value={img.value}>{img.label}</option>
              ))}
            </select>

            {/* Thumbnail Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', padding: '8px', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Đường dẫn: <code>{formData.image}</code>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <input
              type="text"
              className="form-control"
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              placeholder="VD: Thiết kế tối giản, êm ái phong cách Bắc Âu"
            />
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả kỹ hơn về chất liệu, nguồn gốc và công năng của sản phẩm..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu vào Supabase...' : (productToEdit ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
