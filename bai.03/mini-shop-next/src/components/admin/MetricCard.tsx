'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  iconBg?: string;
  icon: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  subtext,
  iconBg = 'var(--primary-light)',
  icon
}: MetricCardProps) {
  return (
    <div className="metric-card">
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
          {title}
        </div>
        <div className="metric-val">{value}</div>
        {subtext && (
          <div style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '4px' }}>
            {subtext}
          </div>
        )}
      </div>

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </div>
    </div>
  );
}
