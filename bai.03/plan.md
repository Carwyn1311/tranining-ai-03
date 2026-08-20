# Kế Hoạch Chuyển Đổi Website Mini Shop Sang Next.js (Bài 03)

Tài liệu kế hoạch chi tiết về việc chuyển đổi toàn bộ mã nguồn website **Mini Shop** (HTML5, CSS3, Vanilla JS từ bài 02) sang **Next.js (App Router)**. Toàn bộ mã nguồn mới sẽ được tổ chức độc lập bên trong thư mục con `bai.03/mini-shop-next/`, đảm bảo giữ nguyên 100% giao diện thiết kế, tái sử dụng tài nguyên hình ảnh thật và nâng cao trải nghiệm người dùng với kiến trúc Component hóa hiện đại.

---

## 1. Mục tiêu & Nguyên tắc chuyển đổi

- **Độc lập tuyệt đối**: Toàn bộ dự án Next.js nằm gọn trong thư mục `d:\tinhocsaoviet.com\training\bai.03\mini-shop-next\`, không chỉnh sửa hay làm ảnh hưởng đến mã nguồn ở `bai.01` và `bai.02`.
- **Giữ nguyên bản sắc thiết kế**: Kế thừa toàn bộ hệ màu xanh lá chủ đạo (`#16a34a`), kiểu chữ Plus Jakarta Sans, bo góc mềm mại, bóng đổ thanh lịch và định dạng giá VND (`290.000đ`).
- **Tái sử dụng hình ảnh**: Toàn bộ thư mục `MiniShop_Assets/assets/` sẽ được đặt vào `public/` của Next.js để phục vụ việc tối ưu hóa hiển thị.
- **Dừng chờ duyệt**: Lên kế hoạch chi tiết để người dùng xem xét, đóng góp ý kiến và duyệt trước khi thực thi.

---

## 2. Danh sách 9 trang sẽ chuyển đổi (Routing Structure)

| # | Trang cũ (Bài 02) | Route mới trong Next.js | Loại Component | Mô tả chức năng & Tương tác |
| :-: | :--- | :--- | :---: | :--- |
| 1 | `index.html` | `app/page.tsx` | Server + Client | **Trang chủ**: Hero banner lớn, 3 cam kết, thanh danh mục pills, lưới 6 sản phẩm nổi bật, phần giới thiệu thương hiệu. |
| 2 | `products.html` | `app/products/page.tsx` | Client Component | **Danh sách sản phẩm**: Sidebar lọc danh mục có số đếm, lọc khoảng giá, ô tìm kiếm thời gian thực, sắp xếp giá/mới nhất, phân trang/load more. |
| 3 | `product-detail.html` | `app/products/[id]/page.tsx` | Client Component | **Chi tiết sản phẩm**: Nhận diện dynamic ID, thư viện ảnh thumbnails chuyển preview mượt mà, chọn số lượng, Thêm giỏ, Yêu thích, Thông số chi tiết, Sản phẩm liên quan. |
| 4 | `cart.html` | `app/cart/page.tsx` | Client Component | **Giỏ hàng**: Bảng sản phẩm trong giỏ, nút `+`/`-` số lượng, xóa món, nhập voucher giảm giá `MINISHOP10`, tóm tắt tiền và tổng thanh toán. |
| 5 | `checkout.html` | `app/checkout/page.tsx` | Client Component | **Thanh toán**: Form nhập thông tin nhận hàng, chọn hình thức thanh toán (COD / Chuyển khoản VietQR / MoMo), tạo mã đơn hàng `#MS-xxxxx`, làm trống giỏ và hiện Modal thành công. |
| 6 | `wishlist.html` | `app/wishlist/page.tsx` | Client Component | **Yêu thích**: Danh sách sản phẩm đã lưu tim, nút thêm nhanh vào giỏ hàng, xóa khỏi yêu thích. |
| 7 | `login.html` | `app/login/page.tsx` | Client Component | **Đăng nhập**: Form đăng nhập kèm nút 1-click điền tài khoản mẫu Khách (`user@minishop.vn`) hoặc Admin (`admin@minishop.vn`). |
| 8 | `register.html` | `app/register/page.tsx` | Client Component | **Đăng ký**: Form đăng ký thành viên mới, lưu trữ thông tin. |
| 9 | `admin.html` | `app/admin/page.tsx` | Client Component | **Khu vực Quản trị Admin**: Tab Dashboard (KPIs, biểu đồ doanh thu Canvas, biểu đồ tròn Donut), Tab Quản lý sản phẩm (CRUD Thêm/Sửa/Xóa), Tab Quản lý đơn hàng. |

---

## 3. Hệ thống Component dùng chung sẽ tách ra

### 3.1. Nhóm Khung & Bố cục chung (`components/layout/`)
- `Header.tsx`: Logo Mini Shop, Menu điều hướng, Tìm kiếm nhanh, Badge giỏ hàng & yêu thích, Khối Auth/User.
- `Footer.tsx`: Chân trang 4 cột (Giới thiệu, Chính sách, Hỗ trợ khách hàng, Liên hệ).
- `AdminSidebar.tsx`: Thanh menu quản trị bên trái.
- `AdminTopBar.tsx`: Thanh trên cùng quản trị (Tìm kiếm, Thông báo, Profile Admin).

### 3.2. Nhóm Sản phẩm & Thương mại (`components/product/`)
- `ProductCard.tsx`: Thẻ sản phẩm chuẩn (ảnh, badge, nút tim, tên, giá format VND, nút Xem chi tiết & Thêm giỏ).
- `CategoryPills.tsx`: Thanh cuộn ngang các danh mục sản phẩm dạng pill.
- `SidebarFilter.tsx`: Cột lọc bên trái (Danh mục, khoảng giá, tình trạng hàng).
- `ImageGallery.tsx`: Thư viện ảnh trang chi tiết (dải thumbnails nhỏ + ảnh lớn preview).
- `QuantitySelector.tsx`: Bộ tăng giảm số lượng (`-`, ô nhập, `+`).
- `SpecsTable.tsx`: Bảng thông số chi tiết của sản phẩm.

### 3.3. Nhóm Giao diện dùng chung (`components/ui/`)
- `Breadcrumb.tsx`: Thanh điều hướng phân cấp (`Home > Danh mục > Tên SP`).
- `Toast.tsx` / `ToastContainer.tsx`: Hệ thống thông báo nổi góc phải màn hình.
- `EmptyState.tsx`: Khung hiển thị rỗng (giỏ hàng trống, wishlist trống, không tìm thấy SP).
- `Modal.tsx`: Popup xác nhận đặt hàng thành công.

### 3.4. Nhóm Quản trị Admin (`components/admin/`)
- `MetricCard.tsx`: Khối thẻ KPI thống kê số lượng.
- `SalesChart.tsx`: Biểu đồ đường cong doanh thu Canvas với hiệu ứng Gradient xanh lá mịn đẹp.
- `OrdersDonutChart.tsx`: Biểu đồ tròn trạng thái đơn hàng.
- `ProductForm.tsx`: Form Thêm mới / Chỉnh sửa sản phẩm cho Admin.
- `ProductTable.tsx`: Bảng dữ liệu sản phẩm kèm nút Sửa và Xóa.
- `OrdersTable.tsx`: Bảng dữ liệu đơn hàng kèm dropdown cập nhật trạng thái đơn.

---

## 4. Quản lý trạng thái & Dữ liệu (State Management)
Sử dụng **React Context API** kết hợp **localStorage sync**:
- `ShopContext.tsx`: Quản lý danh sách sản phẩm, danh mục, thao tác CRUD Admin.
- `CartContext.tsx`: Quản lý giỏ hàng (thêm, sửa số lượng, xóa, tính tổng tiền).
- `WishlistContext.tsx`: Quản lý danh sách yêu thích (thả tim, bỏ tim).
- `AuthContext.tsx`: Quản lý phiên đăng nhập Khách / Admin.

---

## 5. Lộ trình thực hiện 7 bước
1. **Khởi tạo Project**: Tạo dự án Next.js tại `bai.03/mini-shop-next`, cấu hình TypeScript và sao chép assets vào `public/`.
2. **Thiết lập Design System & Data**: Chuyển đổi CSS sang `globals.css`, định nghĩa Types và file dữ liệu mẫu `initialData.ts`.
3. **Xây dựng Context State**: Hoàn thiện Cart, Wishlist, Auth, Shop Contexts với localStorage.
4. **Xây dựng Shared Components**: Header, Footer, ProductCard, CategoryPills, SidebarFilter, Breadcrumb, Toast.
5. **Xây dựng các Trang Khách hàng**: Home (`/`), Products (`/products`), Detail (`/products/[id]`), Cart (`/cart`), Checkout (`/checkout`), Wishlist (`/wishlist`), Login (`/login`), Register (`/register`).
6. **Xây dựng Khu vực Quản trị Admin (`/admin`)**: Dashboard KPI, Biểu đồ Canvas, Quản lý sản phẩm CRUD, Quản lý đơn hàng.
7. **Kiểm thử & Build Verification**: Chạy `npm run build` kiểm tra 0 lỗi và test toàn bộ luồng chức năng.
