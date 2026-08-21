'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/context/ToastContext';
import { Product, Order, OrderStatus } from '@/types';
import { formatVND } from '@/utils/format';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import OrdersDonutChart from '@/components/admin/OrdersDonutChart';
import ProductFormModal from '@/components/admin/ProductFormModal';
import OrderDetailModal from '@/components/admin/OrderDetailModal';

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { products, categories, orders, deleteProduct, updateOrderStatus } = useShop();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Order management states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // RBAC Route Guard: Chỉ cho phép tài khoản có vai ADMIN truy cập
  useEffect(() => {
    if (!isAuthLoading) {
      if (!currentUser) {
        router.push('/login?redirect=/admin');
      } else if (currentUser.role !== 'ADMIN') {
        showToast('Bạn không có quyền truy cập khu vực Quản trị.');
        router.push('/login?error=unauthorized');
      }
    }
  }, [currentUser, isAuthLoading, router, showToast]);

  if (isAuthLoading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e7e5e4', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

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

  // Filtered orders for orders tab
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (p: Product) => {
    if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${p.name}" (Mã #${p.id}) khỏi kho Supabase không?`)) {
      await deleteProduct(p.id);
      showToast(`Đã xóa sản phẩm "${p.name}" khỏi Supabase.`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Đã cập nhật đơn #${orderId} sang trạng thái mới.`);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
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
              <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Danh Sách Đơn Hàng ({filteredOrders.length} đơn)</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cập nhật trạng thái giao hàng, kiểm tra chi tiết và thanh toán</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Status Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-page)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                    {[
                      { id: 'ALL', label: 'Tất cả' },
                      { id: 'PROCESSING', label: 'Đang xử lý' },
                      { id: 'SHIPPING', label: 'Đang giao' },
                      { id: 'COMPLETED', label: 'Hoàn thành' },
                      { id: 'CANCELLED', label: 'Đã hủy' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setOrderStatusFilter(tab.id)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          background: orderStatusFilter === tab.id ? 'var(--primary)' : 'transparent',
                          color: orderStatusFilter === tab.id ? '#ffffff' : 'var(--text-body)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div style={{ position: 'relative', width: '220px' }}>
                    <input
                      type="text"
                      placeholder="Tìm mã đơn, tên, SĐT..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '12.5px', padding: '6px 12px' }}
                    />
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  Không tìm thấy đơn hàng nào phù hợp.
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Số điện thoại &amp; Địa chỉ</th>
                      <th>Sản phẩm đã đặt</th>
                      <th>Tổng tiền</th>
                      <th>Hình thức TT</th>
                      <th>Trạng thái đơn</th>
                      <th style={{ textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          #{order.id}
                        </td>
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
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
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
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleViewOrderDetails(order)}
                            className="btn btn-sm btn-outline"
                            title="Xem chi tiết đơn hàng"
                          >
                            👁️ Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Modal CRUD Product Form */}
      <ProductFormModal
        isOpen={productModalOpen}
        productToEdit={editingProduct}
        onClose={() => setProductModalOpen(false)}
      />

      {/* Modal Order Details */}
      <OrderDetailModal
        isOpen={orderModalOpen}
        order={selectedOrder}
        onClose={() => setOrderModalOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
