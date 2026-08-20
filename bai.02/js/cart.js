/**
 * MINI SHOP - CART SCRIPT (bai.02)
 * Quản lý giỏ hàng, tăng/giảm số lượng, xóa món, mã giảm giá, tính tiền
 */

(function () {
  'use strict';

  let discountRate = 0; // 0% hoặc 0.1 (10%)

  const cartContainer = document.getElementById('cartContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const cartTableBody = document.getElementById('cartTableBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const totalEl = document.getElementById('cartTotal');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');

  function renderCart() {
    const cart = ShopData.getCart();

    if (cart.length === 0) {
      if (cartContainer) cartContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (cartContainer) cartContainer.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    // Render từng hàng trong bảng
    if (cartTableBody) {
      cartTableBody.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
          <tr data-id="${item.id}">
            <td class="cart-product-cell">
              <img src="${item.image}" alt="${item.name}" class="cart-product-thumb" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
              <div class="cart-product-meta">
                <h4><a href="product-detail.html?id=${item.id}">${item.name}</a></h4>
                <p>${item.categoryName || 'Đồ thủ công'}</p>
              </div>
            </td>
            <td class="cart-item-price">${formatVND(item.price)}</td>
            <td>
              <div class="quantity-selector">
                <button class="qty-btn" onclick="handleChangeQty(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" onchange="handleChangeQty(${item.id}, parseInt(this.value, 10))">
                <button class="qty-btn" onclick="handleChangeQty(${item.id}, ${item.quantity + 1})">+</button>
              </div>
            </td>
            <td class="cart-item-total">${formatVND(itemTotal)}</td>
            <td>
              <button class="btn-remove-item" onclick="handleRemoveCartItem(${item.id})" title="Xóa món này">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Tính toán tiền
    const subtotal = ShopData.getCartTotal();
    const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
    const discountAmount = Math.round(subtotal * discountRate);
    const finalTotal = Math.max(0, subtotal + shipping - discountAmount);

    if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatVND(shipping);
    
    if (discountRate > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-${formatVND(discountAmount)} (${discountRate * 100}%)`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = formatVND(finalTotal);
  }

  // Thay đổi số lượng
  window.handleChangeQty = function (productId, newQty) {
    if (isNaN(newQty) || newQty < 1) {
      handleRemoveCartItem(productId);
      return;
    }
    ShopData.updateCartQuantity(productId, newQty);
    renderCart();
  };

  // Xóa 1 món
  window.handleRemoveCartItem = function (productId) {
    const item = ShopData.getCart().find(i => i.id === productId);
    ShopData.removeFromCart(productId);
    showToast(`Đã xóa <strong>${item ? item.name : 'sản phẩm'}</strong> khỏi giỏ hàng.`);
    renderCart();
  };

  // Xóa toàn bộ giỏ hàng
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng?')) {
        ShopData.clearCart();
        showToast('Đã làm trống giỏ hàng.');
        renderCart();
      }
    });
  }

  // Áp dụng mã giảm giá (Mã mẫu: MINISHOP10)
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'MINISHOP10' || code === 'SALE10') {
        discountRate = 0.1;
        showToast('Áp dụng mã giảm giá 10% thành công!');
        renderCart();
      } else if (code === '') {
        showToast('Vui lòng nhập mã giảm giá!', 'danger');
      } else {
        showToast('Mã giảm giá không hợp lệ! Hãy thử mã "MINISHOP10"', 'danger');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    window.addEventListener('cart-updated', renderCart);
  });

})();
