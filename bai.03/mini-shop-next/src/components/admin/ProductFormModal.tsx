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
    image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp',
    stock: 10,
    shortDesc: '',
    description: '',
    badge: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice || 0,
        image: productToEdit.image,
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
        image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp',
        stock: 10,
        shortDesc: '',
        description: '',
        badge: 'Mới'
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      showToast('Vui lòng nhập đầy đủ tên và giá sản phẩm hợp lệ!', 'danger');
      return;
    }

    const selectedCategory = categories.find(c => c.id === formData.category);
    const categoryName = selectedCategory ? selectedCategory.name : 'Khác';

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        ...formData,
        categoryName
      });
      showToast(`Đã cập nhật sản phẩm <strong>${formData.name}</strong> thành công!`);
    } else {
      addProduct({
        ...formData,
        categoryName,
        rating: 5.0,
        reviewsCount: 0,
        gallery: [formData.image],
        isFeatured: false,
        isNew: true
      });
      showToast(`Đã thêm mới sản phẩm <strong>${formData.name}</strong>!`);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '560px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
            {productToEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
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

          <div className="form-group">
            <label>Đường dẫn hình ảnh (Assets path)</label>
            <input
              type="text"
              className="form-control"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/MiniShop_Assets/assets/images/products/..."
            />
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {productToEdit ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
