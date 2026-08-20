'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/context/ToastContext';
import { Product, OrderStatus } from '@/types';
import { formatVND } from '@/utils/format';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import OrdersDonutChart from '@/components/admin/OrdersDonutChart';
import ProductFormModal from '@/components/admin/ProductFormModal';

export default function AdminPage() {
  const { products, categories, orders, deleteProduct, updateOrderStatus } = useShop();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Total metrics
  const totalProducts = products.length;
  const totalCategories = categories.filter(c => c.id !== 'all').length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= 10);

  // Filtered products for products tab
  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (p: Product) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" không?`)) {
      deleteProduct(p.id);
      showToast(`Đã xóa sản phẩm "${p.name}".`);
    }
  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <AdminSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        <AdminTopBar
          title={
            currentTab === 'dashboard'
              ? 'Tổng Quan Hoạt Động Cửa Hàng'
              : currentTab === 'products'
              ? 'Quản Lý Danh Sách Sản Phẩm'
              : 'Quản Lý Danh Sách Đơn Hàng'
          }
        />

        <div className="admin-content-area">
          
          {/* ================================================================
              TAB 1: DASHBOARD
             ================================================================ */}
          {currentTab === 'dashboard' && (
            <>
              {/* 4 Metric Cards */}
              <div className="metrics-grid-4">
                <MetricCard
                  title="Tổng Sản Phẩm"
                  value={totalProducts}
                  subtext="Đang hoạt động trên shop"
                  icon={(
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  )}
                />

                <MetricCard
                  title="Danh Mục Hàng"
                  value={totalCategories}
                  subtext="Ngành hàng nội thất & thủ công"
                  iconBg="var(--secondary-light)"
                  icon={(
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--secondary)" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  )}
                />

                <MetricCard
                  title="Tổng Đơn Hàng"
                  value={totalOrdersCount}
                  subtext="Ghi nhận trên hệ thống"
                  iconBg="var(--accent-amber-light)"
                  icon={(
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-amber)" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                />

                <MetricCard
                  title="Doanh Thu Tích Lũy"
                  value={formatVND(totalRevenue)}
                  subtext="Đơn hoàn thành & đang giao"
                  iconBg="var(--primary-light)"
                  icon={(
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  )}
                />
              </div>

              {/* 2 Charts in Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '24px' }}>
                
                {/* Sales Chart Box */}
                <div className="admin-card-box">
                  <div className="admin-card-header">
                    <div>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                        Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Xu hướng bán lẻ đồ nội thất và decor</span>
                    </div>
                  </div>
                  <SalesChart />
                </div>

                {/* Donut Chart Box */}
                <div className="admin-card-box">
                  <div className="admin-card-header">
                    <div>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                        Trạng Thái Đơn Hàng
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tỷ lệ hoàn thành đơn</span>
                    </div>
                  </div>
                  <OrdersDonutChart />
                </div>

              </div>

              {/* Low stock alerts table */}
              <div className="admin-card-box">
                <div className="admin-card-header">
                  <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                      Cảnh Báo Tồn Kho Ít (≤ 10 sản phẩm)
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cần lên kế hoạch nhập hàng thêm</span>
                  </div>
                  <button onClick={() => setCurrentTab('products')} className="btn btn-sm btn-outline">
                    Xem tất cả &rarr;
                  </button>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá bán</th>
                      <th>Tồn kho</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.image} alt={p.name} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                          </div>
                        </td>
                        <td>{p.categoryName}</td>
                        <td style={{ fontWeight: 700 }}>{formatVND(p.price)}</td>
                        <td>
                          <span style={{ color: 'var(--accent-red)', fontWeight: 800 }}>
                            {p.stock} cái
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-sm btn-outline"
                          >
                            Cập nhật kho
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ================================================================
              TAB 2: PRODUCTS CRUD
             ================================================================ */}
          {currentTab === 'products' && (
            <div className="admin-card-box">
              <div className="admin-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm theo tên..."
                    className="form-control"
                    style={{ width: '280px' }}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Tổng cộng: <strong>{filteredProducts.length}</strong> sản phẩm
                  </span>
                </div>

                <button onClick={handleOpenAddModal} className="btn btn-primary">
                  + Thêm Sản Phẩm Mới
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Hình ảnh & Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá niêm yết</th>
                    <th>Tồn kho</th>
                    <th>Huy hiệu</th>
                    <th style={{ textAlign: 'right' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{p.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700 }}>{p.name}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{p.shortDesc}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.categoryName}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatVND(p.price)}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: p.stock <= 10 ? 'var(--accent-red)' : 'var(--text-main)' }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        {p.badge && (
                          <span style={{ fontSize: '11px', fontWeight: 700, background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-sm btn-outline"
                            title="Chỉnh sửa"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-light)' }}
                            title="Xóa"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              TAB 3: ORDERS MANAGEMENT
             ================================================================ */}
          {currentTab === 'orders' && (
            <div className="admin-card-box">
              <div className="admin-card-header">
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Danh Sách Đơn Hàng Mới Nhất</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cập nhật trạng thái giao hàng và thanh toán</span>
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại & Địa chỉ</th>
                    <th>Sản phẩm đã đặt</th>
                    <th>Tổng tiền</th>
                    <th>Hình thức TT</th>
                    <th>Trạng thái đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{order.email || order.createdAt}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.phone}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '200px' }}>{order.address}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              • {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        {formatVND(order.totalAmount)}
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 600, background: 'var(--bg-page)', padding: '4px 8px', borderRadius: '4px' }}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 700,
                            padding: '6px 10px',
                            color:
                              order.status === 'COMPLETED'
                                ? 'var(--primary)'
                                : order.status === 'SHIPPING'
                                ? '#0284c7'
                                : order.status === 'CANCELLED'
                                ? 'var(--accent-red)'
                                : '#d97706'
                          }}
                        >
                          <option value="PROCESSING">Đang xử lý</option>
                          <option value="SHIPPING">Đang giao</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Modal CRUD Form */}
      <ProductFormModal
        isOpen={productModalOpen}
        productToEdit={editingProduct}
        onClose={() => setProductModalOpen(false)}
      />
    </div>
  );
}
