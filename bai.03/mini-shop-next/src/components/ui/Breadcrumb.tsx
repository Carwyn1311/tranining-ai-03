'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" className="nav-link" style={{ padding: 0 }}>
          Trang chủ
        </Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="separator">&gt;</span>
            {item.href ? (
              <Link href={item.href} className="nav-link" style={{ padding: 0 }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
