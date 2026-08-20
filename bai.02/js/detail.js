/**
 * MINI SHOP - PRODUCT DETAIL SCRIPT (bai.02)
 * Hiển thị chi tiết theo ID, đổi ảnh thumbnail, tăng giảm số lượng, sản phẩm liên quan
 */

(function () {
  'use strict';

  let currentProduct = null;
  let quantity = 1;

  // Lấy ID từ URL (ví dụ: product-detail.html?id=4)
  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id ? Number(id) : 1;
  }

  // Render chi tiết sản phẩm
  function renderProductDetail() {
    const id = getProductIdFromUrl();
    currentProduct = ShopData.getProductById(id) || ShopData.getProducts()[0];

    if (!currentProduct) {
      document.body.innerHTML = '<div class="container" style="padding:100px 0;text-align:center;"><h2>Không tìm thấy sản phẩm!</h2><a href="products.html" class="btn btn-primary" style="margin-top:16px;">Về trang sản phẩm</a></div>';
      return;
    }

    // 1. Cập nhật Title trang và Breadcrumb
    document.title = `${currentProduct.name} - Mini Shop`;
    const breadcrumbCat = document.getElementById('detailBreadcrumbCategory');
    const breadcrumbName = document.getElementById('detailBreadcrumbName');
    if (breadcrumbCat) {
      breadcrumbCat.textContent = currentProduct.categoryName;
      breadcrumbCat.href = `products.html?category=${currentProduct.category}`;
    }
    if (breadcrumbName) {
      breadcrumbName.textContent = currentProduct.name;
    }

    // 2. Cột ảnh & Thumbnails
    const mainImg = document.getElementById('detailMainImage');
    const thumbContainer = document.getElementById('detailThumbnails');
    if (mainImg) mainImg.src = currentProduct.image;

    if (thumbContainer) {
      const gallery = currentProduct.gallery && currentProduct.gallery.length > 0 
        ? currentProduct.gallery 
        : [currentProduct.image];

      // Đảm bảo có ít nhất 4 ảnh thumb (nếu ít hơn, lặp ảnh đẹp)
      const fullGallery = [...gallery];
      while (fullGallery.length < 4) {
        fullGallery.push(gallery[0]);
      }

      thumbContainer.innerHTML = fullGallery.map((imgSrc, idx) => `
        <button class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${imgSrc}">
          <img src="${imgSrc}" alt="${currentProduct.name} - ảnh ${idx + 1}" onerror="this.src='MiniShop_Assets/assets/images/products/San_pham/hero-home-decor-pexels-original.webp'">
        </button>
      `).join('');

      // Sự kiện click thumbnail đổi ảnh chính
      const thumbBtns = thumbContainer.querySelectorAll('.gallery-thumb-btn');
      thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          thumbBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (mainImg) mainImg.src = btn.getAttribute('data-src');
        });
      });
    }

    // 3. Thông tin sản phẩm (Center)
    const titleEl = document.getElementById('detailTitle');
    const categoryBadgeEl = document.getElementById('detailCategoryBadge');
    const priceEl = document.getElementById('detailPrice');
    const originalPriceEl = document.getElementById('detailOriginalPrice');
    const discountTagEl = document.getElementById('detailDiscountTag');
    const descEl = document.getElementById('detailDescription');
    const reviewsEl = document.getElementById('detailReviewsCount');

    if (titleEl) titleEl.textContent = currentProduct.name;
    if (categoryBadgeEl) categoryBadgeEl.textContent = currentProduct.categoryName;
    if (priceEl) priceEl.textContent = formatVND(currentProduct.price);
    if (descEl) descEl.textContent = currentProduct.description || currentProduct.shortDesc;
    if (reviewsEl) reviewsEl.textContent = `(${currentProduct.reviewsCount || 48} đánh giá)`;

    if (currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price) {
      if (originalPriceEl) {
        originalPriceEl.textContent = formatVND(currentProduct.originalPrice);
        originalPriceEl.style.display = 'inline';
      }
      if (discountTagEl) {
        const percent = Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100);
        discountTagEl.textContent = `-${percent}%`;
        discountTagEl.style.display = 'inline-block';
      }
    } else {
      if (originalPriceEl) originalPriceEl.style.display = 'none';
      if (discountTagEl) discountTagEl.style.display = 'none';
    }

    // 4. Trạng thái Yêu thích
    updateWishlistBtnState();

    // 5. Bảng thông số chi tiết (Right Specs)
    const specs = currentProduct.specs || {
      material: 'Gỗ & Gốm cao cấp',
      color: 'Tự nhiên / Tinh tế',
      dimensions: 'Chuẩn theo mẫu',
      weight: '1.2 kg',
      origin: 'Việt Nam'
    };

    const specMaterial = document.getElementById('specMaterial');
    const specColor = document.getElementById('specColor');
    const specDimensions = document.getElementById('specDimensions');
    const specWeight = document.getElementById('specWeight');
    const specOrigin = document.getElementById('specOrigin');

    if (specMaterial) specMaterial.textContent = specs.material || 'Đang cập nhật';
    if (specColor) specColor.textContent = specs.color || 'Tự nhiên';
    if (specDimensions) specDimensions.textContent = specs.dimensions || 'Tiêu chuẩn';
    if (specWeight) specWeight.textContent = specs.weight || '1.0 kg';
    if (specOrigin) specOrigin.textContent = specs.origin || 'Việt Nam';

    // 6. Sản phẩm liên quan (Related Products)
    renderRelatedProducts(currentProduct);
  }

  // Cập nhật trạng thái nút Wishlist
  function updateWishlistBtnState() {
    const wishlistBtn = document.getElementById('detailWishlistBtn');
    if (!wishlistBtn || !currentProduct) return;

    const isWished = ShopData.isWishlisted(currentProduct.id);
    wishlistBtn.classList.toggle('active', isWished);
    const svg = wishlistBtn.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', isWished ? 'currentColor' : 'none');
    }
  }

  // Render sản phẩm liên quan
  function renderRelatedProducts(product) {
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (!relatedGrid) return;

    const allProducts = ShopData.getProducts();
    // Lấy các sản phẩm cùng danh mục (loại trừ chính nó)
    let related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    if (related.length < 4) {
      related = allProducts.filter(p => p.id !== product.id).slice(0, 5);
    } else {
      related = related.slice(0, 5);
    }

    relatedGrid.innerHTML = related.map(p => createProductCardHTML(p)).join('');
  }

  // Khởi tạo sự kiện
  document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();

    // 1. Tăng / Giảm số lượng
    const qtyInput = document.getElementById('detailQtyInput');
    const btnMinus = document.getElementById('detailQtyMinus');
    const btnPlus = document.getElementById('detailQtyPlus');

    if (btnMinus && qtyInput) {
      btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          val--;
          qtyInput.value = val;
          quantity = val;
        }
      });
    }

    if (btnPlus && qtyInput) {
      btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        val++;
        qtyInput.value = val;
        quantity = val;
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        qtyInput.value = val;
        quantity = val;
      });
    }

    // 2. Thêm vào giỏ hàng
    const addCartBtn = document.getElementById('detailAddToCartBtn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        ShopData.addToCart(currentProduct.id, qty);
        showToast(`Đã thêm <strong>${qty} x ${currentProduct.name}</strong> vào giỏ hàng!`);
        updateHeaderBadges();
      });
    }

    // 3. Bấm Yêu thích
    const wishlistBtn = document.getElementById('detailWishlistBtn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        const isAdded = ShopData.toggleWishlist(currentProduct.id);
        updateWishlistBtnState();
        if (isAdded) {
          showToast(`Đã thêm <strong>${currentProduct.name}</strong> vào yêu thích!`);
        } else {
          showToast(`Đã bỏ <strong>${currentProduct.name}</strong> khỏi yêu thích.`);
        }
        updateHeaderBadges();
      });
    }
  });

})();
