const http = require('http');

const endpoints = [
  { path: '/', name: 'Trang chủ (Home)' },
  { path: '/products', name: 'Danh sách sản phẩm (Products)' },
  { path: '/products/1', name: 'Chi tiết sản phẩm ID=1 (Detail)' },
  { path: '/products/2', name: 'Chi tiết sản phẩm ID=2 (Detail)' },
  { path: '/cart', name: 'Giỏ hàng (Cart)' },
  { path: '/checkout', name: 'Thanh toán (Checkout)' },
  { path: '/wishlist', name: 'Yêu thích (Wishlist)' },
  { path: '/login', name: 'Đăng nhập (Login)' },
  { path: '/register', name: 'Đăng ký (Register)' },
  { path: '/admin', name: 'Quản trị (Admin)' },
  { path: '/MiniShop_Assets/assets/images/banner/banner-trang-chu-mini-shop.webp', name: 'Asset Banner Image' },
  { path: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp', name: 'Asset Product Image 1' },
  { path: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp', name: 'Asset Product Image 2' }
];

console.log('======================================================');
console.log('🌐 BẮT ĐẦU TEST TOÀN DIỆN MÁY CHỦ NEXT.JS (HTTP TEST)');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

function testEndpoint(ep) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${ep.path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`  ✅ [PASS] ${ep.name} -> HTTP ${res.statusCode} (Length: ${data.length} bytes)`);
          passed++;
        } else {
          console.log(`  ❌ [FAIL] ${ep.name} -> HTTP ${res.statusCode}`);
          failed++;
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`  ❌ [ERROR] ${ep.name} -> ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function runTests() {
  for (const ep of endpoints) {
    await testEndpoint(ep);
  }

  console.log('\n======================================================');
  console.log(`📊 TỔNG KẾT: ${passed} ĐẠT (PASS) | ${failed} LỖI (FAIL)`);
  if (failed === 0) {
    console.log('🎉 TẤT CẢ CÁC TRANG VÀ TÀI NGUYÊN ĐỀU HOẠT ĐỘNG HOÀN HẢO!');
  }
  console.log('======================================================');
}

runTests();
