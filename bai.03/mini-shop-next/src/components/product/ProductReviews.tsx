'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { getProductReviews, addReview } = useShop();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const reviews = getProductReviews(productId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Sync user if logged in
  React.useEffect(() => {
    if (currentUser) {
      if (!userName) setUserName(currentUser.name);
      if (!userEmail) setUserEmail(currentUser.email);
    }
  }, [currentUser, userName, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      showToast('Vui lòng nhập họ tên của bạn!', 'danger');
      return;
    }
    if (!comment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá!', 'danger');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(productId, {
        userName: userName.trim(),
        userEmail: userEmail.trim() || undefined,
        rating,
        comment: comment.trim()
      });
      showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
      setComment('');
      setShowForm(false);
    } catch (err) {
      showToast('Không thể gửi đánh giá, vui lòng thử lại!', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-light)' }}>
      
      {/* Header & Overall Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Đánh Giá & Nhận Xét Từ Khách Hàng
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <div style={{ color: '#f59e0b', fontSize: '16px' }}>
              {'★'.repeat(Math.round(Number(avgRating)))}
              {'☆'.repeat(5 - Math.round(Number(avgRating)))}
            </div>
            <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>{avgRating}/5</strong>
            <span style={{ color: 'var(--text-muted)' }}>({reviews.length} đánh giá thực tế)</span>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>✍️</span> Viết đánh giá sản phẩm
          </button>
        )}
      </div>

      {/* Review Submission Form Modal / Box */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-page)',
            border: '1px solid var(--primary-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Gửi nhận xét về &quot;{productName}&quot;
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕ Đóng
            </button>
          </div>

          {/* Star Rating Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '6px' }}>
              Xếp hạng chất lượng:
            </label>
            <div style={{ display: 'flex', gap: '8px', fontSize: '24px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    color: star <= (hoverRating || rating) ? '#f59e0b' : '#d1d5db',
                    transition: 'transform 0.15s ease',
                    userSelect: 'none'
                  }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '8px', alignSelf: 'center' }}>
                {rating === 5 ? 'Tuyệt vời (5 sao)' : rating === 4 ? 'Rất tốt (4 sao)' : rating === 3 ? 'Bình thường (3 sao)' : rating === 2 ? 'Kém (2 sao)' : 'Rất tệ (1 sao)'}
              </span>
            </div>
          </div>

          {/* Name and Email Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '4px' }}>
                Họ và tên của bạn <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="VD: Nguyễn Văn Nam"
                className="form-control"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '4px' }}>
                Email (không bắt buộc)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="VD: name@example.com"
                className="form-control"
              />
            </div>
          </div>

          {/* Comment Textarea */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '4px' }}>
              Nội dung trải nghiệm sản phẩm <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về chất liệu, độ hoàn thiện, quá trình đóng gói và sử dụng..."
              className="form-control"
              required
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá ngay'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', background: '#f9fafb', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
          Chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên để lại đánh giá!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                      {rev.userName}
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '13px' }}>
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {rev.createdAt}
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0, paddingLeft: '46px' }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
