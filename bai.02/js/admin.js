/**
 * MINI SHOP - ADMIN PANEL SCRIPT (bai.02)
 * Dashboard KPIs, Canvas Charts, CRUD Quản lý sản phẩm & Quản lý đơn hàng
 */

(function () {
  'use strict';

  let currentEditingProductId = null;

  // --- 1. TAB SWITCHING ---
  window.switchAdminTab = function (tabId) {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const screens = document.querySelectorAll('.admin-tab-screen');
    const titleEl = document.getElementById('topbarTitle');

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
    });

    screens.forEach(screen => {
      screen.classList.toggle('active', screen.id === `tab-${tabId}`);
    });

    const titles = {
      'dashboard': 'Dashboard',
      'categories': 'Category Management',
      'products': 'Product Management',
      'orders': 'Orders Management'
    };

    if (titleEl) titleEl.textContent = titles[tabId] || 'Admin Panel';

    if (tabId === 'dashboard') {
      renderDashboard();
    } else if (tabId === 'products') {
      renderProductManagement();
    } else if (tabId === 'orders') {
      renderOrdersManagement();
    } else if (tabId === 'categories') {
      renderCategoriesManagement();
    }
  };

  // --- 2. DASHBOARD LOGIC ---
  function renderDashboard() {
    const products = ShopData.getProducts();
    const categories = ShopData.getCategories();
    const orders = ShopData.getOrders();

    // 1. KPI Counts
    const totalProdEl = document.getElementById('dashTotalProducts');
    const totalCatEl = document.getElementById('dashTotalCategories');
    const visibleProdEl = document.getElementById('dashVisibleProducts');
    const lowStockEl = document.getElementById('dashLowStock');

    const lowStockCount = products.filter(p => (p.stock || 0) < 10).length;

    if (totalProdEl) totalProdEl.textContent = products.length;
    if (totalCatEl) totalCatEl.textContent = categories.length;
    if (visibleProdEl) visibleProdEl.textContent = products.length;
    if (lowStockEl) lowStockEl.textContent = lowStockCount;

    // 2. Vẽ biểu đồ doanh thu (Sales Overview Canvas)
    drawSalesChart();

    // 3. Vẽ biểu đồ Donut đơn hàng (Orders Overview Donut Canvas)
    drawOrdersDonutChart(orders);

    // 4. Bảng Recent Products
    const recentTable = document.getElementById('dashRecentProductsBody');
    if (recentTable) {
      recentTable.innerHTML = products.slice(0, 6).map(p => {
        const isLow = (p.stock || 0) < 10;
        return `
          <tr>
            <td style="display: flex; align-items: center; gap: 8px;">
              <img src="${p.image}" alt="${p.name}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
              <span style="font-weight: 600;">${p.name}</span>
            </td>
            <td><span class="badge-category-tag">${p.categoryName || 'Sản phẩm'}</span></td>
            <td style="font-weight: 700;">${formatVND(p.price)}</td>
            <td>${p.stock || 15}</td>
            <td>
              <span class="badge-status-pill ${isLow ? 'low-stock' : 'visible'}">
                ${isLow ? 'Low stock' : 'Visible'}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 5. Cảnh báo tồn kho (Stock Alert)
    const stockAlertList = document.getElementById('dashStockAlertList');
    if (stockAlertList) {
      const lowStockItems = products.filter(p => (p.stock || 0) < 15).slice(0, 4);
      stockAlertList.innerHTML = lowStockItems.map(p => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 13px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${p.image}" alt="${p.name}" style="width: 30px; height: 30px; border-radius: 4px; object-fit: cover;" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
            <span style="font-weight: 600;">${p.name}</span>
          </div>
          <span style="font-weight: 700; color: var(--accent-red);">${p.stock || 5} còn lại</span>
        </div>
      `).join('');
    }
  }

  // Vẽ biểu đồ Line Chart Doanh thu
  function drawSalesChart() {
    const canvas = document.getElementById('salesChartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth || 540;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    const points = [
      { label: 'May 26', val: 4.8 },
      { label: 'May 27', val: 6.2 },
      { label: 'May 28', val: 5.4 },
      { label: 'May 29', val: 7.54 },
      { label: 'May 30', val: 5.9 },
      { label: 'May 31', val: 7.1 },
      { label: 'Jun 1', val: 8.6 }
    ];

    ctx.clearRect(0, 0, width, height);

    // Padding
    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(width - padR, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${10 - i * 2.5}K`, padL - 8, y + 3);
    }

    // Tọa độ các điểm
    const coords = points.map((p, idx) => {
      const x = padL + (chartW / (points.length - 1)) * idx;
      const y = padT + chartH - (p.val / 10) * chartH;
      return { x, y, label: p.label, val: p.val };
    });

    // Vẽ Gradient fill
    const gradient = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    gradient.addColorStop(0, 'rgba(22, 163, 74, 0.25)');
    gradient.addColorStop(1, 'rgba(22, 163, 74, 0.0)');

    ctx.beginPath();
    ctx.moveTo(coords[0].x, padT + chartH);
    coords.forEach((pt, idx) => {
      if (idx === 0) {
        ctx.lineTo(pt.x, pt.y);
      } else {
        const prev = coords[idx - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.lineTo(coords[coords.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Vẽ Line
    ctx.beginPath();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    coords.forEach((pt, idx) => {
      if (idx === 0) {
        ctx.moveTo(pt.x, pt.y);
      } else {
        const prev = coords[idx - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.stroke();

    // Vẽ các chấm điểm & Nhãn trục X
    coords.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#16a34a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label X
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.label, pt.x, height - 8);
    });

    // Tooltip highlight at point 3 (May 29)
    const tipPt = coords[3];
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.fillRect(tipPt.x - 45, tipPt.y - 32, 90, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('7,540,000 đ', tipPt.x, tipPt.y - 18);
  }

  // Vẽ Donut chart đơn hàng
  function drawOrdersDonutChart(orders) {
    const canvas = document.getElementById('ordersDonutCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 140;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const radius = 54;
    const lineWidth = 20;

    const slices = [
      { percent: 0.352, color: '#16a34a' }, // Hoàn thành
      { percent: 0.297, color: '#0284c7' }, // Đang xử lý
      { percent: 0.172, color: '#f59e0b' }, // Đang giao
      { percent: 0.078, color: '#8b5cf6' }, // Đã hủy
      { percent: 0.101, color: '#94a3b8' }  // Trả hàng
    ];

    let startAngle = -Math.PI / 2;
    slices.forEach(slice => {
      const sliceAngle = slice.percent * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.strokeStyle = slice.color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      startAngle += sliceAngle;
    });
  }

  // --- 3. PRODUCT MANAGEMENT LOGIC ---
  function renderProductManagement() {
    const products = ShopData.getProducts();
    const categories = ShopData.getCategories();
    const tableBody = document.getElementById('adminProductsTableBody');
    const countDisplay = document.getElementById('adminProdCountDisplay');

    if (countDisplay) {
      countDisplay.textContent = `Hiển thị 1 đến ${products.length} của ${products.length} sản phẩm`;
    }

    if (tableBody) {
      tableBody.innerHTML = products.map((p, idx) => `
        <tr data-id="${p.id}">
          <td><strong>${idx + 1}</strong></td>
          <td>
            <img src="${p.image}" alt="${p.name}" class="admin-prod-thumb" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
          </td>
          <td style="font-weight: 700; color: var(--text-main);">${p.name}</td>
          <td><span class="badge-category-tag">${p.categoryName || 'Sản phẩm'}</span></td>
          <td style="font-weight: 700; color: var(--primary);">${formatVND(p.price)}</td>
          <td><span class="badge-status-pill active">● Active</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="admin-action-btn edit" onclick="handleEditProduct(${p.id})">✏️ Edit</button>
              <button class="admin-action-btn delete" onclick="handleDeleteProduct(${p.id})">🗑️ Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Populate category select in form
    const formCatSelect = document.getElementById('prodFormCategory');
    if (formCatSelect) {
      formCatSelect.innerHTML = categories.filter(c => c.id !== 'all').map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');
    }
  }

  // Chỉnh sửa sản phẩm
  window.handleEditProduct = function (id) {
    const p = ShopData.getProductById(id);
    if (!p) return;

    currentEditingProductId = p.id;
    const titleEl = document.getElementById('prodFormTitle');
    const nameInput = document.getElementById('prodFormName');
    const catSelect = document.getElementById('prodFormCategory');
    const priceInput = document.getElementById('prodFormPrice');
    const imageInput = document.getElementById('prodFormImage');
    const descInput = document.getElementById('prodFormDesc');

    if (titleEl) titleEl.textContent = `Sửa: ${p.name}`;
    if (nameInput) nameInput.value = p.name;
    if (catSelect) catSelect.value = p.category;
    if (priceInput) priceInput.value = p.price;
    if (imageInput) imageInput.value = p.image;
    if (descInput) descInput.value = p.description || p.shortDesc || '';

    // Cuộn tới form
    const form = document.getElementById('adminProductForm');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  };

  // Xóa sản phẩm
  window.handleDeleteProduct = function (id) {
    const p = ShopData.getProductById(id);
    if (!p) return;

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}"?`)) {
      let products = ShopData.getProducts().filter(item => item.id !== id);
      ShopData.saveProducts(products);
      showToast(`Đã xóa sản phẩm <strong>${p.name}</strong> thành công!`);
      renderProductManagement();
      renderDashboard();
    }
  };

  // Reset form
  window.resetProductForm = function () {
    currentEditingProductId = null;
    const form = document.getElementById('adminProductForm');
    const titleEl = document.getElementById('prodFormTitle');
    if (form) form.reset();
    if (titleEl) titleEl.textContent = 'Thêm sản phẩm mới';
  };

  // --- 4. CATEGORIES MANAGEMENT LOGIC ---
  function renderCategoriesManagement() {
    const categories = ShopData.getCategories();
    const tableBody = document.getElementById('adminCategoriesTableBody');

    if (tableBody) {
      tableBody.innerHTML = categories.map((c, idx) => `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td style="font-weight: 700;">${c.name}</td>
          <td>${c.id}</td>
          <td><span class="badge-status-pill active">● Active</span></td>
          <td>
            <button class="admin-action-btn edit" onclick="showToast('Đang mở chỉnh sửa danh mục')">✏️ Edit</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // --- 5. ORDERS MANAGEMENT LOGIC ---
  function renderOrdersManagement() {
    const orders = ShopData.getOrders();
    const tableBody = document.getElementById('adminOrdersTableBody');

    if (tableBody) {
      if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px;">Chưa có đơn hàng nào.</td></tr>`;
        return;
      }

      tableBody.innerHTML = orders.map(order => {
        const itemsSummary = (order.items || []).map(i => `${i.name} (x${i.quantity})`).join(', ');
        return `
          <tr>
            <td><strong>#${order.id}</strong></td>
            <td>
              <div style="font-weight: 700; color: var(--text-main);">${order.customerName}</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">${order.phone}</div>
            </td>
            <td style="max-width: 220px; font-size: 12px; line-height: 1.3;">${order.address}</td>
            <td style="max-width: 200px; font-size: 12px; color: var(--text-body);">${itemsSummary}</td>
            <td style="font-weight: 800; color: var(--primary);">${formatVND(order.totalAmount)}</td>
            <td><span style="font-size: 11.5px; color: var(--text-muted);">${order.createdAt}</span></td>
            <td>
              <select class="admin-select-sm" onchange="handleUpdateOrderStatus('${order.id}', this.value)">
                <option value="PROCESSING" ${order.status === 'PROCESSING' ? 'selected' : ''}>Đang xử lý</option>
                <option value="SHIPPING" ${order.status === 'SHIPPING' ? 'selected' : ''}>Đang giao</option>
                <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>Hoàn thành</option>
                <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>Đã hủy</option>
              </select>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Cập nhật trạng thái đơn hàng
  window.handleUpdateOrderStatus = function (orderId, newStatus) {
    const orders = ShopData.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      const statusNames = {
        'PROCESSING': 'Đang xử lý',
        'SHIPPING': 'Đang giao',
        'COMPLETED': 'Hoàn thành',
        'CANCELLED': 'Đã hủy'
      };
      order.statusText = statusNames[newStatus] || newStatus;
      ShopData.saveOrders(orders);
      showToast(`Đã cập nhật trạng thái đơn hàng #${orderId} thành: ${order.statusText}`);
    }
  };

  // Khởi tạo Admin
  document.addEventListener('DOMContentLoaded', () => {
    // Render ban đầu ở tab Dashboard
    switchAdminTab('dashboard');

    // Lắng nghe submit form sản phẩm
    const prodForm = document.getElementById('adminProductForm');
    if (prodForm) {
      prodForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('prodFormName').value.trim();
        const category = document.getElementById('prodFormCategory').value;
        const price = parseInt(document.getElementById('prodFormPrice').value, 10) || 0;
        const image = document.getElementById('prodFormImage').value.trim() || 'MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp';
        const desc = document.getElementById('prodFormDesc').value.trim();

        if (!name || price <= 0) {
          showToast('Vui lòng nhập tên và giá sản phẩm hợp lệ!', 'danger');
          return;
        }

        const categories = ShopData.getCategories();
        const catObj = categories.find(c => c.id === category);
        const categoryName = catObj ? catObj.name : 'Sản phẩm';

        let products = ShopData.getProducts();

        if (currentEditingProductId) {
          // Cập nhật sản phẩm
          const pIndex = products.findIndex(p => p.id === currentEditingProductId);
          if (pIndex > -1) {
            products[pIndex] = {
              ...products[pIndex],
              name: name,
              category: category,
              categoryName: categoryName,
              price: price,
              image: image,
              description: desc
            };
            ShopData.saveProducts(products);
            showToast(`Đã cập nhật sản phẩm <strong>${name}</strong>!`);
          }
        } else {
          // Thêm sản phẩm mới
          const newId = Date.now();
          const newProduct = {
            id: newId,
            name: name,
            category: category,
            categoryName: categoryName,
            price: price,
            originalPrice: Math.round(price * 1.2),
            image: image,
            gallery: [image],
            rating: 5.0,
            reviewsCount: 1,
            shortDesc: desc.substring(0, 60),
            description: desc,
            stock: 20,
            isFeatured: false,
            isNew: true,
            badge: 'Mới'
          };
          products.unshift(newProduct);
          ShopData.saveProducts(products);
          showToast(`Đã thêm sản phẩm <strong>${name}</strong> thành công!`);
        }

        resetProductForm();
        renderProductManagement();
        renderDashboard();
      });
    }

    // Toggle sidebar on mobile
    const toggleBtn = document.getElementById('adminSidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  });

})();
