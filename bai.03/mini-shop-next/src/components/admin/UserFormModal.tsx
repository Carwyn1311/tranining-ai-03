'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface UserFormModalProps {
  isOpen: boolean;
  userToEdit?: User | null;
  onClose: () => void;
}

export default function UserFormModal({
  isOpen,
  userToEdit,
  onClose
}: UserFormModalProps) {
  const { addUser, updateUser, users } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone || '',
        password: '',
        role: userToEdit.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: 'admin123',
        role: 'CUSTOMER'
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      showToast('Vui lòng nhập họ tên và địa chỉ email hợp lệ!', 'danger');
      return;
    }

    // Check duplicate email when adding new user
    if (!userToEdit) {
      const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        showToast(`Email "${cleanEmail}" đã được sử dụng bởi một tài khoản khác!`, 'danger');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, {
          name: cleanName,
          phone: formData.phone.trim(),
          role: formData.role
        });
        showToast(`Đã cập nhật thông tin tài khoản "${cleanName}"!`);
      } else {
        await addUser({
          name: cleanName,
          email: cleanEmail,
          phone: formData.phone.trim(),
          password: formData.password || 'admin123',
          role: formData.role
        });
        showToast(
          formData.role === 'ADMIN'
            ? `Đã tạo tài khoản Quản trị viên (Admin) "${cleanName}" thành công!`
            : `Đã tạo tài khoản Khách hàng "${cleanName}" thành công!`
        );
      }
      onClose();
    } catch (err) {
      console.error('Lỗi lưu tài khoản:', err);
      showToast('Có lỗi xảy ra khi lưu tài khoản.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '500px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
            {userToEdit ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Người Dùng / Admin Mới'}
          </h2>
          <button onClick={onClose} style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Văn Hoàng"
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ Email *</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="VD: admin.hoang@minishop.vn hoặc user@gmail.com"
              disabled={!!userToEdit}
              required
            />
            {userToEdit && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Email tài khoản không thể thay đổi sau khi tạo.
              </span>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0988 777 888"
              />
            </div>

            <div className="form-group">
              <label>Phân quyền vai trò *</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'CUSTOMER' | 'ADMIN' })}
                style={{ fontWeight: 700 }}
              >
                <option value="CUSTOMER">👤 Khách hàng (CUSTOMER)</option>
                <option value="ADMIN">🛡️ Quản trị viên (ADMIN)</option>
              </select>
            </div>
          </div>

          {!userToEdit && (
            <div className="form-group">
              <label>Mật khẩu khởi tạo *</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="VD: admin123 hoặc 123456"
                required
                minLength={6}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Mật khẩu dùng để đăng nhập vào hệ thống Mini Shop.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : (userToEdit ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
