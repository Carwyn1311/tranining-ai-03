'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';

interface CategoryPillsProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryPills({ activeCategory, onSelectCategory }: CategoryPillsProps) {
  const { categories } = useShop();

  return (
    <section className="categories-bar-section">
      <div className="container">
        <div className="category-pills-list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              type="button"
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
