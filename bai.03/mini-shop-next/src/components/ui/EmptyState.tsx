'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionText = 'Tiếp tục mua sắm',
  actionHref = '/products',
  icon
}: EmptyStateProps) {
  return (
    <div className="empty-state-box">
      <div style={{ color: 'var(--text-light)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        {icon || (
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )}
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
        {description}
      </p>
      {actionText && actionHref && (
        <Link href={actionHref} className="btn btn-primary btn-lg">
          {actionText} &rarr;
        </Link>
      )}
    </div>
  );
}
