'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const { products, categories } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Keyword Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchCat = product.categoryName.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      // Price Range Filter
      if (priceRange === 'under-500') {
        if (product.price >= 500000) return false;
      } else if (priceRange === '500-2000') {
        if (product.price < 500000 || product.price > 2000000) return false;
      } else if (priceRange === 'above-2000') {
        if (product.price <= 2000000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // Default
    });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  // Compute category count dynamically
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  return (
    <div className="products-page">
      <Breadcrumb items={[{ label: 'Tất cả sản phẩm' }]} />

      <div className="container">
        <div className="products-layout-grid">
          
          {/* Left Sidebar Filters */}
          <aside className="products-sidebar">
            
            {/* 1. Category Filter */}
            <div className="sidebar-widget">
              <h3 className="widget-title">
                <span>Danh Mục Sản Phẩm</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </h3>
              <ul className="filter-category-list">
                {categories.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  const isActive = selectedCategory === cat.id;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`filter-category-btn ${isActive ? 'active' : ''}`}
                      >
                        <span className="category-name-with-icon">
                          <span>{cat.name}</span>
                        </span>
                        <span className="category-count-badge">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. Price Range Filter */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Khoảng Giá</h3>
              <div className="filter-radio-group">
                <label className="filter-radio-label">
                  <div>
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={priceRange === 'all'}
                      onChange={() => setPriceRange('all')}
                    />
                    <span>Tất cả mức giá</span>
                  </div>
                </label>
                <label className="filter-radio-label">
                  <div>
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={priceRange === 'under-500'}
                      onChange={() => setPriceRange('under-500')}
                    />
                    <span>Dưới 500.000đ</span>
                  </div>
                </label>
                <label className="filter-radio-label">
                  <div>
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={priceRange === '500-2000'}
                      onChange={() => setPriceRange('500-2000')}
                    />
                    <span>500.000đ - 2.000.000đ</span>
                  </div>
                </label>
                <label className="filter-radio-label">
                  <div>
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={priceRange === 'above-2000'}
                      onChange={() => setPriceRange('above-2000')}
                    />
                    <span>Trên 2.000.000đ</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange('all');
                  setSortBy('default');
                }}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '8px', fontSize: '13px' }}
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </aside>

          {/* Right Main Content */}
          <main className="products-main-content">
            
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="products-page-title-wrap">
                <h1>
                  {selectedCategory === 'all'
                    ? 'Tất Cả Sản Phẩm'
                    : categories.find(c => c.id === selectedCategory)?.name || 'Sản phẩm'}
                </h1>
                <p className="products-count-text">
                  Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm phù hợp
                </p>
              </div>

              <div className="products-toolbar-controls">
                {/* In-page search */}
                <div className="search-in-page-wrap">
                  <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {/* Sort selector */}
                <div className="sort-select-wrap">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sắp xếp sản phẩm"
                  >
                    <option value="default">Sắp xếp: Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A - Z</option>
                    <option value="rating-desc">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid or Empty */}
            {filteredProducts.length > 0 ? (
              <div className="products-grid products-grid-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                description="Không có sản phẩm nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn. Vui lòng thử lại với từ khóa khác."
                actionText="Xem tất cả sản phẩm"
                actionHref="/products"
              />
            )}

          </main>

        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Đang tải danh sách sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
