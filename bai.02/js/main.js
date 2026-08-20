/**
 * MINI SHOP - MAIN CORE JS (bai.02)
 * Các hàm tiện ích dùng chung, Header/Footer state, Toast, Currency VND
 */

// 1. Định dạng tiền tệ VND chuẩn (ví dụ: 290.000đ, 3.490.000đ)
function formatVND(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return amount.toLocaleString('vi-VN') + 'đ';
}

// 2. Hiển thị thông báo Toast góc trên bên phải
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconSVG = type === 'success' 
    ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`
    : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

  toast.innerHTML = `
    <div class="toast-icon">${iconSVG}</div>
    <div class="toast-text">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2800);
}

// 3. Cập nhật Badge giỏ hàng và yêu thích trên Header
function updateHeaderBadges() {
  const cartBadge = document.getElementById('headerCartBadge');
  const wishlistBadge = document.getElementById('headerWishlistBadge');
  const userActionsWrap = document.getElementById('headerUserActions');

  if (cartBadge && typeof ShopData !== 'undefined') {
    const count = ShopData.getCartCount();
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (wishlistBadge && typeof ShopData !== 'undefined') {
    const count = ShopData.getWishlistCount();
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Cập nhật trạng thái đăng nhập
  if (userActionsWrap && typeof ShopData !== 'undefined') {
    const user = ShopData.getCurrentUser();
    if (user) {
      userActionsWrap.innerHTML = `
        <div class="user-badge-nav">
          <div class="user-avatar-mini">${user.name.charAt(0).toUpperCase()}</div>
          <span>${user.name.split(' ').slice(-1)[0]}</span>
        </div>
        ${user.role === 'ADMIN' ? `<a href="admin.html" class="btn btn-sm btn-admin">Quản trị</a>` : ''}
        <button onclick="handleLogout()" class="btn btn-sm btn-outline" title="Đăng xuất">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      `;
    } else {
      userActionsWrap.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline">Đăng nhập</a>
        <a href="register.html" class="btn btn-sm btn-blue">Đăng ký</a>
        <a href="admin.html" class="btn btn-sm btn-admin">Admin</a>
      `;
    }
  }
}

// 4. Xử lý đăng xuất
function handleLogout() {
  if (typeof ShopData !== 'undefined') {
    ShopData.setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản thành công!');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

// 5. Tạo HTML Thẻ sản phẩm chuẩn
function createProductCardHTML(product) {
  const isWished = typeof ShopData !== 'undefined' ? ShopData.isWishlisted(product.id) : false;
  const originalPriceHTML = product.originalPrice && product.originalPrice > product.price 
    ? `<span class="product-card-original-price">${formatVND(product.originalPrice)}</span>` 
    : '';

  const badgeHTML = product.badge 
    ? `<span class="card-badge-top-left ${product.badge.includes('%') ? 'red' : ''}">${product.badge}</span>` 
    : '';

  return `
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-card-media">
        ${badgeHTML}
        <button class="card-wishlist-btn ${isWished ? 'active' : ''}" 
                onclick="handleCardWishlistClick(event, ${product.id})" 
                title="${isWished ? 'Bỏ yêu thích' : 'Yêu thích'}">
          <svg viewBox="0 0 24 24" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
        </a>
      </div>

      <div class="product-card-body">
        <h3 class="product-card-title">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card-price">
          ${formatVND(product.price)}
          ${originalPriceHTML}
        </div>
        <p class="product-card-desc">${product.shortDesc || product.categoryName}</p>

        <div class="product-card-actions">
          <a href="product-detail.html?id=${product.id}" class="btn-card-detail">
            Xem chi tiết &rarr;
          </a>
          <button class="btn-card-add-cart" onclick="handleCardAddToCart(event, ${product.id})" title="Thêm vào giỏ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// 6. Xử lý sự kiện click Thêm vào giỏ từ card
function handleCardAddToCart(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  if (typeof ShopData !== 'undefined') {
    const success = ShopData.addToCart(productId, 1);
    if (success) {
      const p = ShopData.getProductById(productId);
      showToast(`Đã thêm <strong>${p.name}</strong> vào giỏ hàng!`);
      updateHeaderBadges();
    }
  }
}

// 7. Xử lý sự kiện click Yêu thích từ card
function handleCardWishlistClick(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  if (typeof ShopData !== 'undefined') {
    const isAdded = ShopData.toggleWishlist(productId);
    const btn = event.currentTarget;
    const p = ShopData.getProductById(productId);

    if (isAdded) {
      btn.classList.add('active');
      btn.querySelector('svg').setAttribute('fill', 'currentColor');
      showToast(`Đã thêm <strong>${p.name}</strong> vào mục yêu thích!`);
    } else {
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
      showToast(`Đã bỏ <strong>${p.name}</strong> khỏi mục yêu thích.`);
    }
    updateHeaderBadges();
  }
}

// 8. Khởi tạo toàn trang & lắng nghe sự kiện
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges();

  // Lắng nghe sự kiện cập nhật giỏ và wishlist
  window.addEventListener('cart-updated', updateHeaderBadges);
  window.addEventListener('wishlist-updated', updateHeaderBadges);
  window.addEventListener('auth-updated', updateHeaderBadges);

  // Xử lý ô tìm kiếm ở header
  const headerSearchInput = document.getElementById('headerSearchInput');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = headerSearchInput.value.trim();
        if (query) {
          window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
