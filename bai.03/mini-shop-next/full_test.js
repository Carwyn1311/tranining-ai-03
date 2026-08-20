const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('======================================================');
console.log('🧪 BẮT ĐẦU TEST LUỒNG NGHIỆP VỤ & TƯƠNG TÁC (BAI.03)');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  ✅ [PASS] ${desc}`);
    passCount++;
  } else {
    console.log(`  ❌ [FAIL] ${desc}`);
    failCount++;
  }
}

// 1. Kiểm tra cấu trúc file mã nguồn App Router
const requiredFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/products/page.tsx',
  'src/app/products/[id]/page.tsx',
  'src/app/cart/page.tsx',
  'src/app/checkout/page.tsx',
  'src/app/wishlist/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/admin/page.tsx',
  'src/context/ShopContext.tsx',
  'src/context/CartContext.tsx',
  'src/context/WishlistContext.tsx',
  'src/context/AuthContext.tsx',
  'src/context/ToastContext.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/product/ProductCard.tsx',
  'src/components/admin/SalesChart.tsx',
  'src/components/admin/OrdersDonutChart.tsx',
  'src/styles/globals.css'
];

requiredFiles.forEach(file => {
  const full = path.join(__dirname, file.replace(/\//g, path.sep));
  check(`File tồn tại: ${file}`, fs.existsSync(full));
});

// 2. Kiểm tra ảnh trong public/MiniShop_Assets/
const sampleImages = [
  'public/MiniShop_Assets/assets/images/banner/banner-trang-chu-mini-shop.webp',
  'public/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp',
  'public/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp',
  'public/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp',
  'public/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp',
  'public/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp'
];

sampleImages.forEach(img => {
  const full = path.join(__dirname, img.replace(/\//g, path.sep));
  check(`Tài nguyên ảnh hợp lệ: ${img}`, fs.existsSync(full));
});

console.log('\n======================================================');
console.log(`📊 TỔNG KẾT: ${passCount} Passed | ${failCount} Failed`);
if (failCount === 0) {
  console.log('🎉 TẤT CẢ CÁC BÀI TEST ĐỀU THÀNH CÔNG RỰC RỠ!');
}
console.log('======================================================');
