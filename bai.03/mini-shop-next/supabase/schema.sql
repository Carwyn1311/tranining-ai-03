-- ==========================================================
-- BÀI 5: THIẾT LẬP CƠ SỞ DỮ LIỆU SUPABASE CHO MINI SHOP
-- ==========================================================

-- 1. BẢNG DANH MỤC (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG SẢN PHẨM (products)
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    short_desc TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    badge TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG ĐƠN HÀNG (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    note TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'PROCESSING',
    status_text TEXT DEFAULT 'Đang xử lý',
    payment_method TEXT DEFAULT 'COD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TẠM THỜI TẮT RLS VÀ PHÂN QUYỀN TRUY CẬP CHO MÔI TRƯỜNG DEV (Theo Bài 5)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;

-- ==========================================================
-- ĐỔ DỮ LIỆU MẪU (SEED DATA)
-- ==========================================================

-- Xóa dữ liệu cũ nếu có để tránh trùng lặp
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- Đổ dữ liệu Categories
INSERT INTO public.categories (id, name, count) VALUES
('furniture', 'Nội thất', 4),
('decor', 'Đồ mỹ nghệ', 4),
('craft', 'Đồ thủ công', 4),
('lighting', 'Đèn & Ánh sáng', 2),
('kitchen', 'Nhà bếp', 2),
('storage', 'Lưu trữ', 2);

-- Đổ dữ liệu 12 Products
INSERT INTO public.products (
    id, name, category, category_name, price, original_price, 
    image, gallery, rating, reviews_count, short_desc, description, 
    stock, is_featured, is_new, badge, specs
) VALUES
(
    1, 
    'Sofa 2 chỗ Nordic', 
    'furniture', 
    'Nội thất', 
    2990000, 
    3500000, 
    '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp', '/MiniShop_Assets/assets/images/products/San_pham/sofa-phong-khach-original.webp'], 
    5.0, 
    42, 
    'Thiết kế tối giản, êm ái phong cách Bắc Âu', 
    'Sofa 2 chỗ Nordic mang phong cách thiết kế Scandinavia hiện đại, đường nét tinh tế, đệm mút cao cấp đàn hồi cao bọc vải nỉ cao cấp thoáng khí, khung gỗ tự nhiên chống mối mọt chắc chắn.', 
    18, 
    TRUE, 
    TRUE, 
    'Mới', 
    '{"material": "Vải nỉ cao cấp, khung gỗ thông tự nhiên", "color": "Xám sáng Nordic", "dimensions": "Dài 160cm x Sâu 80cm x Cao 78cm", "weight": "32 kg", "origin": "Việt Nam"}'::jsonb
),
(
    2, 
    'Bàn ăn gỗ Sồi', 
    'furniture', 
    'Nội thất', 
    3490000, 
    4200000, 
    '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp', '/MiniShop_Assets/assets/images/products/San_pham/bo-ban-an-go-original.webp'], 
    4.9, 
    38, 
    'Gỗ sồi tự nhiên, bền đẹp vân gỗ sang trọng', 
    'Bộ bàn ăn làm từ 100% gỗ sồi tự nhiên được xử lý sấy kỹ thuật chống cong vênh, mối mọt. Lớp sơn phủ PU mờ bảo vệ tối đa vân gỗ tự nhiên, tạo cảm giác ấm cúng cho bữa cơm gia đình.', 
    12, 
    TRUE, 
    TRUE, 
    'Bán chạy', 
    '{"material": "Gỗ sồi nhập khẩu nguyên khối", "color": "Gỗ tự nhiên (Natural Oak)", "dimensions": "Dài 140cm x Rộng 75cm x Cao 75cm", "weight": "28 kg", "origin": "Việt Nam"}'::jsonb
),
(
    3, 
    'Đèn thả trần Minimal', 
    'lighting', 
    'Đèn & Ánh sáng', 
    599000, 
    750000, 
    '/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp', '/MiniShop_Assets/assets/images/products/San_pham/den-tre-thu-cong-original.webp'], 
    4.8, 
    29, 
    'Ánh sáng dịu nhẹ, kết hợp gỗ & kim loại tinh tế', 
    'Đèn thả trần Minimal kết hợp chao đèn kim loại sơn tĩnh điện và chóp gỗ tự nhiên. Cho góc chiếu sáng tập trung, tạo điểm nhấn hoàn hảo cho bàn ăn, quầy bar hoặc góc đọc sách.', 
    25, 
    TRUE, 
    FALSE, 
    '-20%', 
    '{"material": "Hợp kim nhôm sơn tĩnh điện + Gỗ sồi", "color": "Trắng sứ & Gỗ sáng", "dimensions": "Đường kính 30cm, Dây treo 1.2m điều chỉnh", "weight": "1.2 kg", "origin": "Việt Nam"}'::jsonb
),
(
    4, 
    'Bình gốm Decor', 
    'decor', 
    'Đồ mỹ nghệ', 
    290000, 
    350000, 
    '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp', '/MiniShop_Assets/assets/images/products/San_pham/binh-gom-trang-tri-original.webp'], 
    5.0, 
    56, 
    'Gốm sứ cao cấp, trang nhã tinh khôi', 
    'Bình gốm sứ mỹ nghệ tráng men mờ thủ công. Thích hợp cắm hoa tươi, cành lá trang trí hoặc bày kệ tủ tạo điểm nhấn trang nhã cho phòng khách, bàn làm việc.', 
    40, 
    TRUE, 
    FALSE, 
    'Hot', 
    '{"material": "Gốm nung nhiệt độ cao men mờ", "color": "Trắng be ngà", "dimensions": "Cao 22cm x Bầu 15cm x Miệng 8cm", "weight": "0.8 kg", "origin": "Bát Tràng, Việt Nam"}'::jsonb
),
(
    5, 
    'Kệ gỗ đa năng', 
    'storage', 
    'Lưu trữ', 
    1293000, 
    1550000, 
    '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp', '/MiniShop_Assets/assets/images/products/San_pham/ke-go-trang-tri-original.webp'], 
    4.7, 
    19, 
    'Tiết kiệm không gian, thiết kế phân tầng thông minh', 
    'Kệ gỗ 4 tầng đa năng bằng gỗ cao su tự nhiên bền chắc, các góc cạnh bo tròn an toàn. Phù hợp để sách báo, đồ trang trí, chậu cây cảnh hoặc vật dụng gia đình.', 
    9, 
    TRUE, 
    FALSE, 
    'Sắp hết', 
    '{"material": "Gỗ cao su tự nhiên ghép thanh", "color": "Gỗ vàng sáng tự nhiên", "dimensions": "Rộng 60cm x Sâu 30cm x Cao 120cm", "weight": "9.5 kg", "origin": "Việt Nam"}'::jsonb
),
(
    6, 
    'Giỏ mây lưu trữ', 
    'craft', 
    'Đồ thủ công', 
    199000, 
    260000, 
    '/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp', '/MiniShop_Assets/assets/images/products/San_pham/gio-may-dan-original.webp'], 
    4.9, 
    64, 
    'Thân thiện, tiện dụng đan tay truyền thống', 
    'Giỏ mây đan thủ công từ sợi mây tự nhiên đã qua xử lý chống ẩm mốc. Thiết kế có tay cầm tiện lợi, dùng để chứa đồ chơi, quần áo gọn gàng hoặc làm phụ kiện chụp ảnh phong cách mộc mạc.', 
    7, 
    TRUE, 
    FALSE, 
    'Thủ công', 
    '{"material": "Mây tự nhiên 100% đan tay", "color": "Vàng rơm tự nhiên", "dimensions": "Dài 38cm x Rộng 28cm x Cao 20cm", "weight": "0.6 kg", "origin": "Làng nghề mây tre đan Phú Vinh, Việt Nam"}'::jsonb
),
(
    7, 
    'Bộ bình gốm Minimal Style', 
    'decor', 
    'Đồ mỹ nghệ', 
    499000, 
    699000, 
    '/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp', '/MiniShop_Assets/assets/images/products/San_pham/bo-binh-gom-minimal-original.webp'], 
    5.0, 
    48, 
    'Bộ 3 bình gốm vân rãnh tối giản sang trọng', 
    'Set 3 bình gốm nghệ thuật dáng thấp và cao phối màu Pastel hiện đại (kem, xanh olive, trắng). Tạo chiều sâu kiến trúc tinh tế khi bày trí trên kệ tủ phòng khách.', 
    15, 
    FALSE, 
    TRUE, 
    '-29%', 
    '{"material": "Gốm nung men sần cao cấp", "color": "Beige, Green Olive, White", "dimensions": "Bình lớn: 20cm, Bình trung: 15cm, Bình nhỏ: 10cm", "weight": "1.4 kg (bộ 3 cái)", "origin": "Bát Tràng, Việt Nam"}'::jsonb
),
(
    8, 
    'Tranh treo Macrame thủ công', 
    'craft', 
    'Đồ thủ công', 
    450000, 
    550000, 
    '/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp', '/MiniShop_Assets/assets/images/products/San_pham/tranh-treo-macrame-original.webp'], 
    4.9, 
    31, 
    'Dệt sợi cotton tự nhiên phong cách Bohemian', 
    'Tranh treo tường Macrame đan tay từ sợi cotton xoắn mềm mại trên thanh gỗ mộc tự nhiên. Mang đến phong cách nghệ thuật Boho lãng mạn và ấm cúng cho không gian.', 
    14, 
    FALSE, 
    TRUE, 
    'Boho Art', 
    '{"material": "Sợi Cotton tự nhiên + Cành gỗ mộc", "color": "Trắng kem tự nhiên", "dimensions": "Rộng 45cm x Dài thả 75cm", "weight": "0.7 kg", "origin": "Việt Nam"}'::jsonb
),
(
    9, 
    'Khay gỗ họa tiết khắc Laser', 
    'craft', 
    'Đồ thủ công', 
    250000, 
    300000, 
    '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp', '/MiniShop_Assets/assets/images/products/San_pham/khay-go-hoa-van-original.webp'], 
    4.8, 
    22, 
    'Khay gỗ xà cừ khắc hoa văn kỷ hà độc đáo', 
    'Khay gỗ tròn đa dụng chạm khắc hoa văn tinh xảo, thích hợp làm khay trà, đĩa bánh ngọt hoặc lót nến thơm trang trí.', 
    22, 
    FALSE, 
    FALSE, 
    'Mới', 
    '{"material": "Gỗ xà cừ nguyên khối", "color": "Nâu cánh gián tự nhiên", "dimensions": "Đường kính 28cm x Cao 2.5cm", "weight": "0.5 kg", "origin": "Việt Nam"}'::jsonb
),
(
    10, 
    'Đèn lồng tre nghệ thuật', 
    'lighting', 
    'Đèn & Ánh sáng', 
    380000, 
    480000, 
    '/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp', '/MiniShop_Assets/assets/images/products/San_pham/den-long-tre-original.webp'], 
    4.7, 
    17, 
    'Nan tre uốn thủ công, bóng đổ lung linh', 
    'Chao đèn lồng tre đan tạo hiệu ứng ánh sáng nan tre ấm áp huyền ảo khi thắp sáng trong phòng khách hoặc ban công.', 
    16, 
    FALSE, 
    FALSE, 
    'Thủ công', 
    '{"material": "Tre già xử lý hun khói", "color": "Nâu tre hun khói", "dimensions": "Đường kính 35cm x Cao 40cm", "weight": "0.8 kg", "origin": "Việt Nam"}'::jsonb
),
(
    11, 
    'Chậu cây để bàn Decor', 
    'furniture', 
    'Nội thất', 
    185000, 
    220000, 
    '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp', '/MiniShop_Assets/assets/images/products/San_pham/chau-cay-de-ban-original.webp'], 
    4.9, 
    45, 
    'Gốm tráng men kèm chân đế gỗ sồi mộc mạc', 
    'Chậu cây mini để bàn làm việc, phòng ngủ tạo không gian xanh mát và cảm giác thư giãn cho gia chủ.', 
    30, 
    FALSE, 
    FALSE, 
    'Xanh mát', 
    '{"material": "Gốm trắng + Đế gỗ sồi tự nhiên", "color": "Trắng mờ & Gỗ", "dimensions": "Đường kính 14cm x Cao 16cm (cả đế)", "weight": "0.6 kg", "origin": "Việt Nam"}'::jsonb
),
(
    12, 
    'Khay gỗ chữ nhật tay cầm', 
    'craft', 
    'Đồ thủ công', 
    320000, 
    390000, 
    '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp', 
    ARRAY['/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp', '/MiniShop_Assets/assets/images/products/San_pham/khay-go-trang-tri-original.webp'], 
    4.8, 
    27, 
    'Thiết kế chữ nhật tối giản, tiện dụng phục vụ', 
    'Khay phục vụ bằng gỗ tự nhiên chống thấm nước, tay cầm khoét rãnh mượt mà, tiện lợi cho việc bưng trà bánh hoặc trang trí bàn trà.', 
    18, 
    FALSE, 
    FALSE, 
    'Tiện ích', 
    '{"material": "Gỗ sồi tự nhiên", "color": "Gỗ tự nhiên vân sáng", "dimensions": "Dài 40cm x Rộng 25cm x Cao 4cm", "weight": "0.9 kg", "origin": "Việt Nam"}'::jsonb
);

-- Đổ dữ liệu Orders mẫu
INSERT INTO public.orders (
    id, customer_name, phone, email, address, note, 
    items, total_amount, shipping_fee, status, status_text, payment_method, created_at
) VALUES
(
    'MS-89101', 
    'Nguyễn Văn An', 
    '0912 345 678', 
    'nguyenvanan@gmail.com', 
    '123 Cầu Giấy, Quận Cầu Giấy, Hà Nội', 
    NULL, 
    '[{"id": 1, "name": "Sofa 2 chỗ Nordic", "price": 2990000, "quantity": 1, "image": "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp"}, {"id": 4, "name": "Bình gốm Decor", "price": 290000, "quantity": 2, "image": "/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp"}]'::jsonb, 
    3570000, 
    0, 
    'COMPLETED', 
    'Hoàn thành', 
    'COD', 
    '2025-05-28 14:30:00+07'
),
(
    'MS-89102', 
    'Trần Thị Mai', 
    '0987 654 321', 
    'mai.tran@gmail.com', 
    '45 Lê Lợi, Quận 1, TP. Hồ Chí Minh', 
    NULL, 
    '[{"id": 2, "name": "Bàn ăn gỗ Sồi", "price": 3490000, "quantity": 1, "image": "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp"}]'::jsonb, 
    3490000, 
    0, 
    'SHIPPING', 
    'Đang giao hàng', 
    'BANK_TRANSFER', 
    '2025-05-29 09:15:00+07'
);
