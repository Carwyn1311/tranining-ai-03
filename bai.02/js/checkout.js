/**
 * MINI SHOP - CHECKOUT SCRIPT (bai.02)
 * Xử lý thông tin giao hàng, phương thức thanh toán, tạo đơn hàng & thông báo thành công
 */

(function () {
  'use strict';

  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutForm = document.getElementById('checkoutForm');
  const successModal = document.getElementById('successModal');
  const orderCodeDisplay = document.getElementById('orderCodeDisplay');
  const paymentLabels = document.querySelectorAll('.payment-method-label');

  function renderCheckoutSummary() {
    const cart = ShopData.getCart();

    if (cart.length === 0) {
      // Nếu giỏ trống, chuyển hướng về giỏ hàng
      window.location.href = 'cart.html';
      return;
    }

    if (checkoutItemsList) {
      checkoutItemsList.innerHTML = cart.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; font-size: 13.5px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-light);" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
            <div>
              <strong style="display: block; color: var(--text-main);">${item.name}</strong>
              <span style="color: var(--text-muted); font-size: 12px;">Số lượng: ${item.quantity}</span>
            </div>
          </div>
          <span style="font-weight: 700; color: var(--text-main);">${formatVND(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    const subtotal = ShopData.getCartTotal();
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    if (checkoutSubtotal) checkoutSubtotal.textContent = formatVND(subtotal);
    if (checkoutShipping) checkoutShipping.textContent = shipping === 0 ? 'Miễn phí' : formatVND(shipping);
    if (checkoutTotal) checkoutTotal.textContent = formatVND(total);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary();

    // Điền sẵn thông tin nếu người dùng đã đăng nhập
    const currentUser = ShopData.getCurrentUser();
    if (currentUser) {
      const nameInput = document.getElementById('customerName');
      const emailInput = document.getElementById('customerEmail');
      const phoneInput = document.getElementById('customerPhone');

      if (nameInput) nameInput.value = currentUser.name || '';
      if (emailInput) emailInput.value = currentUser.email || '';
      if (phoneInput) phoneInput.value = currentUser.phone || '';
    }

    // Toggle active style cho payment method
    paymentLabels.forEach(label => {
      label.addEventListener('click', () => {
        paymentLabels.forEach(l => l.classList.remove('active'));
        label.classList.add('active');
      });
    });

    // Xử lý gửi form đặt hàng
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const note = document.getElementById('orderNote').value.trim();
        const paymentMethodEl = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'COD';

        if (!name || !phone || !address) {
          showToast('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!', 'danger');
          return;
        }

        const cart = ShopData.getCart();
        const subtotal = ShopData.getCartTotal();
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const totalAmount = subtotal + shippingFee;

        // Tạo đơn hàng mới trong hệ thống
        const newOrder = ShopData.createOrder({
          customerName: name,
          phone: phone,
          email: email,
          address: address,
          note: note,
          paymentMethod: paymentMethod,
          items: cart,
          totalAmount: totalAmount,
          shippingFee: shippingFee
        });

        // Xóa giỏ hàng
        ShopData.clearCart();

        // Hiển thị modal xác nhận đặt hàng thành công
        if (orderCodeDisplay) {
          orderCodeDisplay.textContent = `Mã đơn hàng: ${newOrder.id}`;
        }

        if (successModal) {
          successModal.classList.add('show');
        }
      });
    }
  });

})();
