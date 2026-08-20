'use client';

import React from 'react';
import { ProductSpecs } from '@/types';

interface SpecsTableProps {
  specs?: ProductSpecs;
}

export default function SpecsTable({ specs }: SpecsTableProps) {
  if (!specs) return null;

  return (
    <div className="specs-card-box">
      <h3 className="specs-card-title">Thông Số Kỹ Thuật</h3>
      <table className="specs-table">
        <tbody>
          {specs.material && (
            <tr>
              <td className="specs-label">Chất liệu:</td>
              <td className="specs-val">{specs.material}</td>
            </tr>
          )}
          {specs.color && (
            <tr>
              <td className="specs-label">Màu sắc:</td>
              <td className="specs-val">{specs.color}</td>
            </tr>
          )}
          {specs.dimensions && (
            <tr>
              <td className="specs-label">Kích thước:</td>
              <td className="specs-val">{specs.dimensions}</td>
            </tr>
          )}
          {specs.weight && (
            <tr>
              <td className="specs-label">Trọng lượng:</td>
              <td className="specs-val">{specs.weight}</td>
            </tr>
          )}
          {specs.origin && (
            <tr>
              <td className="specs-label">Xuất xứ:</td>
              <td className="specs-val">{specs.origin}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
