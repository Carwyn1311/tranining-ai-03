# Bài 02: Website Thương Mại Điện Tử Mini Shop

## 1. Giới thiệu dự án
Dự án xây dựng hoàn chỉnh hệ thống website thương mại điện tử **Mini Shop** chuyên kinh doanh đồ thủ công mỹ nghệ, đồ gốm trang trí và nội thất tối giản, bám sát các layout chuẩn theo bộ ảnh mẫu (References) và sử dụng tài nguyên hình ảnh thật trong thư mục `MiniShop_Assets`.

---

## 2. Cấu trúc thư mục dự án
```text
bai.02/
├── MiniShop_Assets/      # Tài nguyên hình ảnh sản phẩm thật & ảnh mẫu layout
├── index.html            # 1. Trang chủ (Hero banner, Cam kết, Danh mục, Sản phẩm nổi bật)
├── products.html         # 2. Trang danh sách sản phẩm (Lưới sản phẩm, Lọc danh mục, Lọc giá, Tìm kiếm, Sắp xếp)
├── product-detail.html   # 3. Trang chi tiết sản phẩm (Gallery thumbnails, Chọn số lượng, Thêm giỏ, Yêu thích, Thông số, SP liên quan)
├── cart.html             # 4. Trang giỏ hàng (Bảng sản phẩm, Tăng giảm số lượng, Xóa món, Mã giảm giá, Tạm tính & Tổng tiền)
├── checkout.html         # 5. Trang thanh toán (Form thông tin giao hàng, Phương thức thanh toán, Đặt hàng & Tạo đơn)
├── wishlist.html         # 6. Trang danh sách yêu thích (Liệt kê sản phẩm đã lưu tim, Thêm nhanh vào giỏ)
├── login.html            # 7. Trang đăng nhập (Hỗ trợ 1-click tài khoản khách và tài khoản Admin)
├── register.html         # 8. Trang đăng ký tài khoản
├── admin.html            # 9. Khu vực quản trị Admin (Dashboard KPI, Biểu đồ doanh thu Canvas, CRUD Sản phẩm, Quản lý Đơn hàng)
├── css/
│   ├── style.css         # Design system tokens, Header, Footer, Hero, Product Cards, Toast, Buttons
│   ├── products.css      # Layout bộ lọc sidebar & danh sách sản phẩm
│   ├── detail.css        # Layout thư viện ảnh & bảng thông số chi tiết
│   ├── cart.css          # Layout giỏ hàng & thanh toán
│   ├── auth.css          # Layout đăng nhập / đăng ký
│   └── admin.css         # Layout bảng điều khiển Admin, biểu đồ & bảng quản lý
└── js/
    ├── data.js           # Bộ dữ liệu mẫu sản phẩm thật, danh mục, đơn hàng & đồng bộ localStorage
    ├── main.js           # Core utils (Định dạng VND, Toast notification, Cập nhật badge giỏ/wishlist, Header state)
    ├── products.js       # Logic lọc realtime (Danh mục, Giá, Tìm kiếm, Sắp xếp, Phân trang)
    ├── detail.js         # Logic trang chi tiết (Load ID từ URL, Đổi thumbnail, Tăng giảm số lượng)
    ├── cart.js           # Logic giỏ hàng (Cập nhật số lượng, Xóa món, Mã coupon, Tính tổng tiền)
    ├── checkout.js       # Logic đặt hàng (Validate, Tạo mã đơn MS-xxxxx, Reset giỏ, Modal xác nhận)
    ├── wishlist.js       # Logic quản lý danh sách yêu thích
    ├── auth.js           # Phân quyền Khách vs Admin, lưu phiên đăng nhập
    └── admin.js          # Admin Dashboard KPI, Biểu đồ Canvas, CRUD Thêm/Sửa/Xóa sản phẩm, Đổi trạng thái đơn hàng
```

---

## 3. Bảng đối chiếu & Kiểm tra các tính năng yêu cầu

| Tính năng / Màn hình | Yêu cầu thiết kế & kỹ thuật | Trạng thái | Chi tiết triển khai |
| :--- | :--- | :---: | :--- |
| **Khung chung & Trang chủ** | Header bám chuẩn ảnh, banner lớn + 3 cam kết, danh mục pills, lưới SP nổi bật, footer 4 cột | ✅ **ĐẠT** | Menusticky, tìm kiếm nhanh, badge giỏ hàng/wishlist, ảnh banner & sản phẩm thật trong assets, giá VND chuẩn (`290.000đ`). |
| **Trang danh sách SP** | Lưới thẻ SP có ảnh, tên, giá, nút Xem chi tiết, nút Thêm giỏ, Tim yêu thích | ✅ **ĐẠT** | Bố cục chuẩn ảnh `mini-shop-product-list-reference.webp`, dùng chung Header và Footer. |
| **Bộ lọc & Tìm kiếm** | Bấm danh mục lọc ngay, ô tìm kiếm lọc dần theo chữ, lọc khoảng giá, không tải lại trang | ✅ **ĐẠT** | Lọc mượt mà bằng JavaScript trên DOM, có đếm số lượng SP động và hỗ trợ sắp xếp theo giá/mới nhất. |
| **Trang chi tiết SP** | Ảnh lớn, danh sách thumbnails chọn ảnh, tên, giá VND, mô tả, nút Thêm giỏ, Yêu thích, Thông số, SP liên quan | ✅ **ĐẠT** | Bố cục 3 cột chuẩn ảnh `mini-shop-product-detail-reference.webp`, nhận diện ID qua URL param `?id=...`. |
| **Giỏ hàng (Cart)** | Bấm Thêm giỏ badge tăng, mở giỏ thấy danh sách món, tăng/giảm số lượng, xóa món, tính tổng tiền, nhớ khi đổi trang | ✅ **ĐẠT** | Lưu trữ đồng bộ qua `localStorage`, hỗ trợ mã giảm giá `MINISHOP10`, cập nhật badge realtime trên mọi trang. |
| **Chức năng Yêu thích** | Nút tim đổi màu khi bấm, lưu danh sách, trang Wishlist liệt kê món đã lưu, bấm lại thì bỏ lưu | ✅ **ĐẠT** | Lưu trữ `localStorage`, trang `wishlist.html` hỗ trợ thêm nhanh vào giỏ hàng. |
| **Trang Thanh toán** | Form họ tên, SĐT, địa chỉ, chọn hình thức thanh toán, tóm tắt đơn, bấm Đặt hàng báo thành công & làm trống giỏ | ✅ **ĐẠT** | Tạo mã đơn tự động `#MS-xxxxx`, lưu vào danh sách đơn của hệ thống Admin, hiển thị modal chúc mừng. |
| **Đăng nhập & Đăng ký** | Đăng nhập tài khoản thường vào trang khách, tài khoản admin vào trang quản trị | ✅ **ĐẠT** | Có nút 1-click điền tài khoản mẫu (User: `user@minishop.vn` / Admin: `admin@minishop.vn`), điều hướng đúng luồng. |
| **Khu Quản trị Admin** | Màn Tổng quan KPI + Biểu đồ doanh thu; màn Quản lý SP thêm/sửa/xóa; màn Quản lý Đơn hàng | ✅ **ĐẠT** | Bố cục chuẩn theo 2 ảnh admin reference: Biểu đồ canvas mượt mà, CRUD sản phẩm trực tiếp, quản lý trạng thái đơn hàng. |

---

## 4. Hướng dẫn trải nghiệm & Sử dụng
1. Mở file [index.html](file:///d:/tinhocsaoviet.com/training/bai.02/index.html) trên trình duyệt để vào Trang chủ.
2. Điều hướng qua [products.html](file:///d:/tinhocsaoviet.com/training/bai.02/products.html) để thử bộ lọc danh mục và tìm kiếm thời gian thực.
3. Bấm vào sản phẩm bất kỳ để mở [product-detail.html](file:///d:/tinhocsaoviet.com/training/bai.02/product-detail.html).
4. Thử thêm món vào [cart.html](file:///d:/tinhocsaoviet.com/training/bai.02/cart.html) và thanh toán tại [checkout.html](file:///d:/tinhocsaoviet.com/training/bai.02/checkout.html).
5. Mở [login.html](file:///d:/tinhocsaoviet.com/training/bai.02/login.html) chọn nút "Quản trị viên (Admin)" hoặc mở trực tiếp [admin.html](file:///d:/tinhocsaoviet.com/training/bai.02/admin.html) để quản lý sản phẩm và đơn hàng.
