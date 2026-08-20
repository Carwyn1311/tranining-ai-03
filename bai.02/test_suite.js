const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = __dirname;

console.log('======================================================');
console.log('🚀 BẮT ĐẦU KIỂM TRA & TEST TOÀN BỘ HỆ THỐNG MINI SHOP');
console.log('======================================================\n');

let totalErrors = 0;
let totalWarnings = 0;
let totalPasses = 0;

function assert(condition, message, isWarning = false) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    totalPasses++;
  } else {
    if (isWarning) {
      console.log(`  ⚠️ [WARN] ${message}`);
      totalWarnings++;
    } else {
      console.log(`  ❌ [FAIL] ${message}`);
      totalErrors++;
    }
  }
}

// -----------------------------------------------------------------------------
// TEST 1: KIỂM TRA TẤT CẢ FILE HTML, CSS, JS CÓ TỒN TẠI VÀ HỢP LỆ
// -----------------------------------------------------------------------------
console.log('--- TEST 1: Kiểm tra cấu trúc file & liên kết tài nguyên ---');

const expectedHtmlFiles = [
  'index.html', 'products.html', 'product-detail.html',
  'cart.html', 'checkout.html', 'wishlist.html',
  'login.html', 'register.html', 'admin.html'
];

expectedHtmlFiles.forEach(file => {
  const filePath = path.join(baseDir, file);
  const exists = fs.existsSync(filePath);
  assert(exists, `File HTML tồn tại: ${file}`);
  
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.includes('<!DOCTYPE html>') && content.includes('</html>'), `Cấu trúc HTML hợp lệ: ${file}`);
    assert(content.includes('js/data.js') || file.includes('register') || file.includes('login'), `Import js/data.js trong ${file}`);
    assert(content.includes('css/style.css'), `Import css/style.css trong ${file}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 2: KIỂM TRA TẤT CẢ ĐƯỜNG DẪN HÌNH ẢNH TRONG DATA.JS CÓ THỰC SỰ TỒN TẠI
// -----------------------------------------------------------------------------
console.log('\n--- TEST 2: Kiểm tra đường dẫn hình ảnh sản phẩm trong assets ---');

const dataContent = fs.readFileSync(path.join(baseDir, 'js', 'data.js'), 'utf8');

// Trích xuất tất cả chuỗi đường dẫn ảnh
const imgPathRegex = /(?:image|gallery|banner):\s*['"]([^'"]+)['"]/g;
let match;
const foundImages = [];
while ((match = imgPathRegex.exec(dataContent)) !== null) {
  foundImages.push(match[1]);
}

// Thêm ảnh trong mảng gallery
const galleryItemRegex = /'(MiniShop_Assets\/[^']+)'/g;
while ((match = galleryItemRegex.exec(dataContent)) !== null) {
  if (!foundImages.includes(match[1])) {
    foundImages.push(match[1]);
  }
}

foundImages.forEach(relPath => {
  const fullPath = path.join(baseDir, relPath.replace(/\//g, path.sep));
  const exists = fs.existsSync(fullPath);
  assert(exists, `Ảnh tồn tại: ${relPath}`);
});

// -----------------------------------------------------------------------------
// TEST 3: TEST TOÀN BỘ LOGIC CỦA SHOPDATA (GIỎ HÀNG, YÊU THÍCH, ĐƠN HÀNG, LOCALSTORAGE)
// -----------------------------------------------------------------------------
console.log('\n--- TEST 3: Kiểm tra Logic ShopData (Thêm/Sửa/Xóa giỏ, Yêu thích, Đơn hàng) ---');

// Mock localStorage & window for Node environment
const mockStorage = {};
const sandbox = {
  localStorage: {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  },
  window: {
    dispatchEvent: () => {},
    addEventListener: () => {}
  },
  CustomEvent: class { constructor(type, detail) { this.type = type; this.detail = detail; } },
  console: console
};

vm.createContext(sandbox);
vm.runInContext(dataContent + '\n; sandbox_export_ShopData = ShopData;', sandbox);
const ShopData = sandbox.sandbox_export_ShopData;

// 3.1 Test danh sách sản phẩm
const initialProducts = ShopData.getProducts();
assert(Array.isArray(initialProducts) && initialProducts.length >= 12, `Lấy danh sách sản phẩm mặc định (${initialProducts.length} sản phẩm)`);

// 3.2 Test lấy chi tiết sản phẩm theo ID
const p1 = ShopData.getProductById(1);
assert(p1 && p1.name === 'Sofa 2 chỗ Nordic' && p1.price === 2990000, `Lấy sản phẩm ID=1: "${p1 ? p1.name : ''}"`);

const pInvalid = ShopData.getProductById(9999);
assert(pInvalid === null, 'Lấy sản phẩm ID không tồn tại trả về null an toàn');

// 3.3 Test giỏ hàng (Thêm, tăng, giảm, xóa, tính tiền)
ShopData.clearCart();
assert(ShopData.getCart().length === 0, 'Làm trống giỏ hàng ban đầu');

ShopData.addToCart(1, 2); // Thêm 2 Sofa (2 x 2.990.000 = 5.980.000)
ShopData.addToCart(4, 1); // Thêm 1 Bình gốm (1 x 290.000 = 290.000)
assert(ShopData.getCart().length === 2, 'Thêm 2 mặt hàng khác nhau vào giỏ');
assert(ShopData.getCartCount() === 3, 'Tổng số lượng sản phẩm trong giỏ = 3');
assert(ShopData.getCartTotal() === 6270000, `Tổng tiền giỏ hàng tính đúng: ${ShopData.getCartTotal()}đ == 6.270.000đ`);

// Cập nhật số lượng
ShopData.updateCartQuantity(4, 3); // 3 Bình gốm (3 x 290.000 = 870.000)
assert(ShopData.getCartCount() === 5, 'Cập nhật số lượng món thành công');
assert(ShopData.getCartTotal() === 6850000, `Tổng tiền sau cập nhật: ${ShopData.getCartTotal()}đ == 6.850.000đ`);

// Xóa 1 món
ShopData.removeFromCart(1);
assert(ShopData.getCart().length === 1 && ShopData.getCart()[0].id === 4, 'Xóa món ID=1 thành công');

// 3.4 Test Yêu thích (Wishlist toggle)
ShopData.saveWishlist([]);
assert(ShopData.getWishlistCount() === 0, 'Wishlist rỗng ban đầu');

const added1 = ShopData.toggleWishlist(2); // Yêu thích Bàn ăn gỗ Sồi
assert(added1 === true && ShopData.isWishlisted(2) === true, 'Thêm ID=2 vào Wishlist');
assert(ShopData.getWishlistCount() === 1, 'Số lượng Wishlist = 1');

const added2 = ShopData.toggleWishlist(2); // Bỏ yêu thích
assert(added2 === false && ShopData.isWishlisted(2) === false, 'Bỏ ID=2 khỏi Wishlist khi bấm lần 2');
assert(ShopData.getWishlistCount() === 0, 'Số lượng Wishlist trở về 0');

// 3.5 Test Đặt hàng (Checkout -> Order creation)
const orderData = {
  customerName: 'Trần Văn Test',
  phone: '0988777666',
  email: 'test@example.com',
  address: '123 Đường Test, Hà Nội',
  items: ShopData.getCart(),
  totalAmount: ShopData.getCartTotal(),
  shippingFee: 0,
  paymentMethod: 'COD'
};

const createdOrder = ShopData.createOrder(orderData);
assert(createdOrder && createdOrder.id.startsWith('MS-'), `Tạo đơn hàng thành công với mã: ${createdOrder.id}`);

const ordersList = ShopData.getOrders();
assert(ordersList.some(o => o.id === createdOrder.id), 'Đơn hàng mới được lưu vào danh sách đơn của hệ thống');

// 3.6 Test Admin CRUD (Thêm, sửa, xóa sản phẩm)
const testNewProd = {
  id: 999,
  name: 'Đèn Bàn Gỗ Tinh Xảo',
  category: 'lighting',
  categoryName: 'Đèn & Ánh sáng',
  price: 650000,
  image: 'MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp',
  stock: 10
};

let currentProds = ShopData.getProducts();
currentProds.unshift(testNewProd);
ShopData.saveProducts(currentProds);
assert(ShopData.getProductById(999) !== null, 'Admin thêm sản phẩm mới thành công');

// Sửa sản phẩm
currentProds = ShopData.getProducts();
const editIdx = currentProds.findIndex(p => p.id === 999);
currentProds[editIdx].price = 720000;
ShopData.saveProducts(currentProds);
assert(ShopData.getProductById(999).price === 720000, 'Admin cập nhật giá sản phẩm thành công');

// Xóa sản phẩm
currentProds = ShopData.getProducts().filter(p => p.id !== 999);
ShopData.saveProducts(currentProds);
assert(ShopData.getProductById(999) === null, 'Admin xóa sản phẩm thành công');

// -----------------------------------------------------------------------------
// TỔNG KẾT
// -----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`📊 KẾT QUẢ TEST: ${totalPasses} Passed | ${totalWarnings} Warnings | ${totalErrors} Errors`);
if (totalErrors === 0) {
  console.log('🎉 TẤT CẢ CÁC BÀI TEST & CHECK LỖI ĐỀU HOÀN THÀNH XUẤT SẮC (100% PASS)!');
} else {
  console.log('⚠️ Phát hiện lỗi cần khắc phục!');
}
console.log('======================================================');
