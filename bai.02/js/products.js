/**
 * MINI SHOP - PRODUCTS PAGE SCRIPT (bai.02)
 * Xử lý lọc danh mục, tìm kiếm thời gian thực, lọc giá, sắp xếp
 */

(function () {
  'use strict';

  let currentCategory = 'all';
  let currentPriceRange = 'all';
  let currentSearch = '';
  let currentSort = 'newest';
  let displayedCount = 8; // Phân trang ban đầu hiển thị 8 món

  // Elements
  const productsGrid = document.getElementById('productsListGrid');
  const countDisplay = document.getElementById('productsCountDisplay');
  const searchInput = document.getElementById('pageSearchInput');
  const sortSelect = document.getElementById('pageSortSelect');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const categoryBtns = document.querySelectorAll('.filter-category-btn');
  const priceRadios = document.querySelectorAll('input[name="priceFilter"]');

  // Đọc params từ URL nếu có (?category=... hoặc ?q=...)
  function initFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const queryParam = urlParams.get('q');

    if (catParam) {
      currentCategory = catParam;
      categoryBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === catParam) {
          categoryBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    }

    if (queryParam) {
      currentSearch = queryParam;
      if (searchInput) searchInput.value = queryParam;
    }
  }

  // Cập nhật số lượng sản phẩm trên các nút danh mục sidebar
  function updateSidebarCategoryCounts() {
    const allProducts = ShopData.getProducts();
    
    categoryBtns.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      const badge = btn.querySelector('.category-count-badge');
      if (badge) {
        if (cat === 'all') {
          badge.textContent = allProducts.length;
        } else {
          const cnt = allProducts.filter(p => p.category === cat).length;
          badge.textContent = cnt;
        }
      }
    });
  }

  // Lọc và render danh sách sản phẩm
  function filterAndRenderProducts() {
    let list = ShopData.getProducts();

    // 1. Lọc theo danh mục
    if (currentCategory !== 'all') {
      list = list.filter(p => p.category === currentCategory);
    }

    // 2. Lọc theo khoảng giá
    if (currentPriceRange !== 'all') {
      if (currentPriceRange === 'under500') {
        list = list.filter(p => p.price < 500000);
      } else if (currentPriceRange === '500to1000') {
        list = list.filter(p => p.price >= 500000 && p.price <= 1000000);
      } else if (currentPriceRange === '1000to2000') {
        list = list.filter(p => p.price > 1000000 && p.price <= 2000000);
      } else if (currentPriceRange === 'over2000') {
        list = list.filter(p => p.price > 2000000);
      }
    }

    // 3. Lọc theo từ khóa tìm kiếm
    if (currentSearch.trim() !== '') {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // 4. Sắp xếp
    if (currentSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'popular') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else {
      // Mới nhất (id giảm dần)
      list.sort((a, b) => b.id - a.id);
    }

    // 5. Cập nhật thông báo số lượng
    const totalMatching = list.length;
    const toShow = list.slice(0, displayedCount);
    
    if (countDisplay) {
      if (totalMatching === 0) {
        countDisplay.textContent = 'Không tìm thấy sản phẩm phù hợp';
      } else {
        countDisplay.textContent = `Hiển thị 1–${toShow.length} trên tổng số ${totalMatching} sản phẩm`;
      }
    }

    // 6. Hiển thị lên lưới
    if (totalMatching === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3 class="empty-state-title">Không tìm thấy sản phẩm</h3>
          <p class="empty-state-text">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bớt bộ lọc.</p>
          <button class="btn btn-primary" onclick="resetAllFilters()">Xem tất cả sản phẩm</button>
        </div>
      `;
      if (loadMoreWrap) loadMoreWrap.style.display = 'none';
      return;
    }

    productsGrid.innerHTML = toShow.map(p => createProductCardHTML(p)).join('');

    // Nút Load More
    if (loadMoreWrap) {
      if (displayedCount < totalMatching) {
        loadMoreWrap.style.display = 'block';
      } else {
        loadMoreWrap.style.display = 'none';
      }
    }
  }

  // Reset bộ lọc
  window.resetAllFilters = function () {
    currentCategory = 'all';
    currentPriceRange = 'all';
    currentSearch = '';
    currentSort = 'newest';
    displayedCount = 8;

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'newest';

    categoryBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-category') === 'all');
    });

    const allPriceRadio = document.querySelector('input[name="priceFilter"][value="all"]');
    if (allPriceRadio) allPriceRadio.checked = true;

    filterAndRenderProducts();
  };

  // Khởi chạy khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    initFromUrlParams();
    updateSidebarCategoryCounts();
    filterAndRenderProducts();

    // 1. Sự kiện chọn danh mục
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        displayedCount = 8;
        filterAndRenderProducts();
      });
    });

    // 2. Sự kiện chọn khoảng giá
    priceRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentPriceRange = e.target.value;
        displayedCount = 8;
        filterAndRenderProducts();
      });
    });

    // 3. Sự kiện tìm kiếm thời gian thực (realtime search)
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        displayedCount = 8;
        filterAndRenderProducts();
      });
    }

    // 4. Sự kiện chọn sắp xếp
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndRenderProducts();
      });
    }

    // 5. Sự kiện bấm Xem thêm (Load More)
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        displayedCount += 4;
        filterAndRenderProducts();
      });
    }
  });

})();
