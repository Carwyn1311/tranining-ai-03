'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { useToast } from '@/context/ToastContext';
import { Product, Category, User, Order, OrderStatus, Review, Coupon } from '@/types';
import { formatVND } from '@/utils/format';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import OrdersDonutChart from '@/components/admin/OrdersDonutChart';
import ProductFormModal from '@/components/admin/ProductFormModal';
import CategoryFormModal from '@/components/admin/CategoryFormModal';
import UserFormModal from '@/components/admin/UserFormModal';
import CouponFormModal from '@/components/admin/CouponFormModal';
import OrderDetailModal from '@/components/admin/OrderDetailModal';

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, users, isLoading: isAuthLoading, deleteUser } = useAuth();
  const {
    products,
    categories,
    orders,
    reviews,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    deleteReview
  } = useShop();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Product modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Category modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categorySearch, setCategorySearch] = useState('');

  // User modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Order management states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Coupon modal states
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponSearch, setCouponSearch] = useState('');
  const [couponStatusFilter, setCouponStatusFilter] = useState('ALL');

  // Review management states
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('ALL');

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
  const totalUsersCount = users.length;
  const totalOrdersCount = orders.length;
  const totalReviewsCount = reviews.length;
  const totalCouponsCount = coupons.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= 10);

  // Filtered products
  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
  });

  // Filtered categories
  const filteredCategories = categories.filter(c => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesSearch = !userSearch.trim() ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));
    return matchesRole && matchesSearch;
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered coupons
  const filteredCoupons = coupons.filter(c => {
    const matchesStatus = couponStatusFilter === 'ALL' || (couponStatusFilter === 'ACTIVE' ? c.isActive : !c.isActive);
    const matchesSearch = !couponSearch.trim() ||
      c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(couponSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    const matchesRating = reviewRatingFilter === 'ALL' || String(r.rating) === reviewRatingFilter;
    const matchesSearch = !reviewSearch.trim() ||
      r.userName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      (r.userEmail && r.userEmail.toLowerCase().includes(reviewSearch.toLowerCase())) ||
      r.comment.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      String(r.productId).includes(reviewSearch);
    return matchesRating && matchesSearch;
  });

  // Handlers for products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct(id);
      showToast(`Đã xóa sản phẩm <strong>${name}</strong>.`);
    }
  };

  // Handlers for categories
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (id === 'all') {
      showToast('Không thể xóa danh mục mặc định!', 'danger');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      deleteCategory(id);
      showToast(`Đã xóa danh mục <strong>${name}</strong>.`);
    }
  };

  // Handlers for users
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (id: string | number, email: string) => {
    if (email === currentUser?.email) {
      showToast('Bạn không thể tự xóa tài khoản đang đăng nhập của chính mình!', 'danger');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${email}"?`)) {
      deleteUser(id);
      showToast(`Đã xóa tài khoản <strong>${email}</strong>.`);
    }
  };

  // Handlers for coupons
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (c: Coupon) => {
    setEditingCoupon(c);
    setCouponModalOpen(true);
  };

  const handleDeleteCoupon = (code: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}"?`)) {
      deleteCoupon(code);
      showToast(`Đã xóa mã giảm giá <strong>${code}</strong>.`);
    }
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    updateCoupon(coupon.code, { isActive: !coupon.isActive });
    showToast(`Đã ${!coupon.isActive ? 'kích hoạt' : 'tạm dừng'} mã <strong>${coupon.code}</strong>.`);
  };

  // Handlers for reviews
  const handleDeleteReview = (id: string, author: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa đánh giá của "${author}"?`)) {
      deleteReview(id);
      showToast(`Đã xóa đánh giá của <strong>${author}</strong>.`);
    }
  };

  // Handlers for orders
  const handleOpenOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    showToast(`Đã cập nhật trạng thái đơn #${orderId}`);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="admin-main">
        <AdminTopBar title="Bảng Điều Khiển Quản Trị Hệ Thống" />

        <div className="admin-content-container">

          {/* ======================================================== */}
          {/* TAB 1: TỔNG QUAN (DASHBOARD) */}
          {/* ======================================================== */}
          {currentTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Tổng Quan Hoạt Động Cửa Hàng
                </h1>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Theo dõi số liệu kinh doanh, đơn hàng thực tế và trạng thái kho hàng
                </p>
              </div>

              {/* 6 Top Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <MetricCard
                  title="Doanh Thu Tích Lũy"
                  value={formatVND(totalRevenue)}
                  subtext="Từ tất cả đơn hàng hợp lệ"
                  icon={<span>💰</span>}
                />
                <MetricCard
                  title="Tổng Đơn Hàng"
                  value={totalOrdersCount}
                  subtext="Đơn đặt qua hệ thống"
                  icon={<span>📦</span>}
                />
                <MetricCard
                  title="Tổng Sản Phẩm"
                  value={totalProducts}
                  subtext={`${totalCategories} danh mục hàng`}
                  icon={<span>🏷️</span>}
                />
                <MetricCard
                  title="Khách Hàng & User"
                  value={totalUsersCount}
                  subtext="Tài khoản trong hệ thống"
                  icon={<span>👥</span>}
                />
                <MetricCard
                  title="Mã Khuyến Mãi"
                  value={totalCouponsCount}
                  subtext={`${coupons.filter(c => c.isActive).length} mã đang hoạt động`}
                  icon={<span>🎟️</span>}
                />
                <MetricCard
                  title="Đánh Giá Khách Hàng"
                  value={totalReviewsCount}
                  subtext="Nhận xét từ người mua"
                  icon={<span>⭐</span>}
                />
              </div>

              {/* Charts Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <SalesChart />
                </div>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <OrdersDonutChart />
                </div>
              </div>

              {/* Low Stock Warning Table */}
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span> Cảnh Báo Tồn Kho Sắp Hết ({lowStockProducts.length} món &le; 10 sp)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('products')}
                    className="btn btn-outline btn-sm"
                  >
                    Xem tất cả sản phẩm &rarr;
                  </button>
                </div>

                {lowStockProducts.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                    ✅ Tồn kho dồi dào, không có sản phẩm nào sắp hết hàng!
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>Danh mục</th>
                          <th>Giá bán</th>
                          <th>Tồn kho</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map(p => (
                          <tr key={p.id}>
                            <td>
                              <img src={p.image} alt={p.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                            </td>
                            <td style={{ fontWeight: 700 }}>{p.name}</td>
                            <td>{p.categoryName}</td>
                            <td>{formatVND(p.price)}</td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '12px' }}>
                                Còn {p.stock} cái
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(p)}
                                className="btn btn-outline btn-sm"
                              >
                                Nhập kho
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: QUẢN LÝ SẢN PHẨM (PRODUCTS) */}
          {/* ======================================================== */}
          {currentTab === 'products' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Sản Phẩm ({products.length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Thêm mới, sửa đổi thông số kỹ thuật, giá bán và hình ảnh sản phẩm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>＋</span> Thêm sản phẩm mới
                </button>
              </div>

              {/* Search bar */}
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm, danh mục..."
                  className="form-control"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ maxWidth: '380px' }}
                />
              </div>

              {/* Product Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th>Đánh giá</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            Không tìm thấy sản phẩm nào khớp với tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{p.id}</td>
                            <td>
                              <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                              {p.isFeatured && <span style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>Nổi bật</span>}
                            </td>
                            <td>{p.categoryName}</td>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatVND(p.price)}</td>
                            <td>
                              <span style={{ fontWeight: 600, color: p.stock <= 5 ? '#dc2626' : 'var(--text-body)' }}>
                                {p.stock} cái
                              </span>
                            </td>
                            <td>
                              ⭐ {p.rating} ({p.reviewsCount})
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="btn btn-outline btn-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: QUẢN LÝ DANH MỤC (CATEGORIES) */}
          {/* ======================================================== */}
          {currentTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Danh Mục Ngành Hàng ({categories.filter(c => c.id !== 'all').length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Phân loại hàng hóa và cấu hình icon đại diện cho danh mục
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>＋</span> Thêm danh mục mới
                </button>
              </div>

              {/* Category Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã (ID / Slug)</th>
                        <th>Icon</th>
                        <th>Tên danh mục</th>
                        <th>Số lượng sản phẩm</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.filter(c => c.id !== 'all').map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{c.id}</td>
                          <td style={{ fontSize: '20px' }}>{c.icon || '📦'}</td>
                          <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</td>
                          <td>
                            <span style={{ padding: '2px 10px', background: '#f3f4f6', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                              {c.count || 0} sản phẩm
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategory(c)}
                                className="btn btn-outline btn-sm"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(c.id, c.name)}
                                className="btn btn-outline btn-sm"
                                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: QUẢN LÝ ĐƠN HÀNG (ORDERS) */}
          {/* ======================================================== */}
          {currentTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Đơn Hàng ({orders.length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Theo dõi tiến độ giao nhận, thông tin khách hàng và trạng thái thanh toán
                  </p>
                </div>
              </div>

              {/* Status Filters & Search */}
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                  {[
                    { id: 'ALL', label: 'Tất cả đơn' },
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
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: orderStatusFilter === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        background: orderStatusFilter === tab.id ? 'var(--primary-light)' : '#ffffff',
                        color: orderStatusFilter === tab.id ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên khách, SĐT..."
                  className="form-control"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {/* Orders Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Số món</th>
                        <th>Tổng tiền</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            Không có đơn hàng nào khớp với bộ lọc.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(o => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{o.id}</td>
                            <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                            <td>{o.phone}</td>
                            <td>{o.items.reduce((s, i) => s + i.quantity, 0)} món</td>
                            <td style={{ fontWeight: 700 }}>{formatVND(o.totalAmount)}</td>
                            <td>
                              <span style={{ fontSize: '12px', padding: '2px 6px', background: '#f3f4f6', borderRadius: '4px' }}>
                                {o.paymentMethod === 'COD' ? 'COD' : o.paymentMethod === 'BANK_TRANSFER' ? 'VietQR' : 'MoMo'}
                              </span>
                            </td>
                            <td>
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  border: '1px solid var(--border-light)',
                                  background: o.status === 'COMPLETED' ? '#ecfdf5' : o.status === 'CANCELLED' ? '#fef2f2' : o.status === 'SHIPPING' ? '#eff6ff' : '#fffbeb',
                                  color: o.status === 'COMPLETED' ? '#059669' : o.status === 'CANCELLED' ? '#dc2626' : o.status === 'SHIPPING' ? '#2563eb' : '#d97706'
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
                                onClick={() => handleOpenOrderDetail(o)}
                                className="btn btn-outline btn-sm"
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: QUẢN LÝ MÃ GIẢM GIÁ (COUPONS) */}
          {/* ======================================================== */}
          {currentTab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Mã Giảm Giá & Voucher ({coupons.length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Thiết lập mã coupon khuyến mãi, giới hạn đơn hàng và mức chiết khấu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCoupon}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>＋</span> Tạo mã giảm giá mới
                </button>
              </div>

              {/* Filter and search */}
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'ALL', label: 'Tất cả voucher' },
                    { id: 'ACTIVE', label: 'Đang kích hoạt' },
                    { id: 'INACTIVE', label: 'Tạm dừng' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCouponStatusFilter(tab.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: couponStatusFilter === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        background: couponStatusFilter === tab.id ? 'var(--primary-light)' : '#ffffff',
                        color: couponStatusFilter === tab.id ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Tìm mã voucher, mô tả..."
                  className="form-control"
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {/* Coupon Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Voucher</th>
                        <th>% Giảm giá</th>
                        <th>Giảm tối đa</th>
                        <th>Đơn tối thiểu</th>
                        <th>Mô tả chương trình</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoupons.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            Không tìm thấy mã giảm giá nào.
                          </td>
                        </tr>
                      ) : (
                        filteredCoupons.map(c => (
                          <tr key={c.code}>
                            <td>
                              <span style={{ fontWeight: 800, padding: '3px 8px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', border: '1px dashed var(--primary)' }}>
                                {c.code}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              {c.discountPercent > 0 ? `${c.discountPercent}%` : 'Freeship'}
                            </td>
                            <td>{c.maxDiscount ? formatVND(c.maxDiscount) : 'Không giới hạn'}</td>
                            <td>{c.minOrderValue ? formatVND(c.minOrderValue) : '0đ'}</td>
                            <td style={{ fontSize: '13px', color: 'var(--text-body)', maxWidth: '220px' }}>{c.description || '-'}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleToggleCoupon(c)}
                                style={{
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: c.isActive ? '#ecfdf5' : '#f3f4f6',
                                  color: c.isActive ? '#059669' : '#6b7280'
                                }}
                              >
                                {c.isActive ? '● Đang bật' : '○ Tắt'}
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCoupon(c)}
                                  className="btn btn-outline btn-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCoupon(c.code)}
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: QUẢN LÝ ĐÁNH GIÁ (REVIEWS) */}
          {/* ======================================================== */}
          {currentTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Đánh Giá & Nhận Xét ({reviews.length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Kiểm duyệt bình luận và xếp hạng sao từ khách hàng mua sắm
                  </p>
                </div>
              </div>

              {/* Rating Filters & Search */}
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'ALL', label: 'Tất cả sao' },
                    { id: '5', label: '5 sao ★' },
                    { id: '4', label: '4 sao ★' },
                    { id: '3', label: '3 sao ★' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setReviewRatingFilter(tab.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: reviewRatingFilter === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        background: reviewRatingFilter === tab.id ? 'var(--primary-light)' : '#ffffff',
                        color: reviewRatingFilter === tab.id ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Tìm người gửi, email, nội dung..."
                  className="form-control"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {/* Review Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Khách hàng</th>
                        <th>Xếp hạng sao</th>
                        <th>Nội dung đánh giá</th>
                        <th>Thời gian</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            Chưa có đánh giá nào khớp với tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredReviews.map(r => {
                          const prod = products.find(p => p.id === r.productId);
                          return (
                            <tr key={r.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {prod?.image && <img src={prod.image} alt={prod.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />}
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{prod?.name || `SP #${r.productId}`}</div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mã #{r.productId}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{r.userName}</div>
                                {r.userEmail && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.userEmail}</div>}
                              </td>
                              <td>
                                <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                                  {'★'.repeat(r.rating)}
                                  {'☆'.repeat(5 - r.rating)}
                                </span>
                              </td>
                              <td style={{ fontSize: '13px', color: 'var(--text-body)', maxWidth: '280px' }}>
                                {r.comment}
                              </td>
                              <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {r.createdAt}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(r.id, r.userName)}
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN (USERS) */}
          {/* ======================================================== */}
          {currentTab === 'users' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Quản Lý Tài Khoản & Phân Quyền ({users.length})
                  </h1>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Xem danh sách người dùng, cấp quyền Quản trị viên (Admin) và quản lý tài khoản
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddUser}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>＋</span> Thêm tài khoản mới
                </button>
              </div>

              {/* Role filter and search */}
              <div style={{ background: '#ffffff', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'ALL', label: 'Tất cả' },
                    { id: 'ADMIN', label: 'Quản trị viên (Admin)' },
                    { id: 'CUSTOMER', label: 'Khách hàng (Customer)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setUserRoleFilter(tab.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: userRoleFilter === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        background: userRoleFilter === tab.id ? 'var(--primary-light)' : '#ffffff',
                        color: userRoleFilter === tab.id ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Tìm theo họ tên, email, SĐT..."
                  className="form-control"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {/* Users Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Email đăng nhập</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò (Phân quyền)</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            Không tìm thấy tài khoản nào khớp với tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: u.role === 'ADMIN' ? 'var(--primary-light)' : '#f3f4f6', color: u.role === 'ADMIN' ? 'var(--primary)' : '#4b5563', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-body)' }}>{u.email}</td>
                            <td>{u.phone || '-'}</td>
                            <td>
                              <span
                                style={{
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  background: u.role === 'ADMIN' ? 'var(--primary-light)' : '#f3f4f6',
                                  color: u.role === 'ADMIN' ? 'var(--primary)' : '#4b5563'
                                }}
                              >
                                {u.role === 'ADMIN' ? '🛡️ Quản trị viên' : '👤 Khách hàng'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="btn btn-outline btn-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                  disabled={u.email === currentUser.email}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={editingProduct}
      />

      <CategoryFormModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categoryToEdit={editingCategory}
      />

      <UserFormModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userToEdit={editingUser}
      />

      <CouponFormModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        editingCoupon={editingCoupon}
        onSave={async (coupData) => {
          if (editingCoupon) {
            await updateCoupon(editingCoupon.code, coupData);
          } else {
            await addCoupon(coupData);
          }
        }}
      />

      <OrderDetailModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleStatusChange}
      />
    </div>
  );
}
