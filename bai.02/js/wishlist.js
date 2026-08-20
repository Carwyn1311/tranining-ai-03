/**
 * MINI SHOP - WISHLIST SCRIPT (bai.02)
 * Hiển thị danh sách yêu thích, thêm vào giỏ, xóa khỏi yêu thích
 */

(function () {
  'use strict';

  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('wishlistEmptyState');
  const countEl = document.getElementById('wishlistCountText');

  function renderWishlist() {
    const ids = ShopData.getWishlist();
    const allProducts = ShopData.getProducts();
    const wishlistedProducts = allProducts.filter(p => ids.includes(p.id));

    if (wishlistedProducts.length === 0) {
      if (grid) grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (countEl) countEl.textContent = 'Bạn chưa lưu sản phẩm nào.';
      return;
    }

    if (grid) grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    if (countEl) countEl.textContent = `Bạn đã lưu ${wishlistedProducts.length} sản phẩm yêu thích:`;

    if (grid) {
      grid.innerHTML = wishlistedProducts.map(p => createProductCardHTML(p)).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    window.addEventListener('wishlist-updated', renderWishlist);
  });

})();
