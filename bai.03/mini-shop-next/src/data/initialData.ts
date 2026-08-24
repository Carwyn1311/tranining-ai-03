import { Product, Category, Order, User, Review, Coupon } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'Tất cả', count: 12 },
  { id: 'furniture', name: 'Nội thất', count: 4 },
  { id: 'decor', name: 'Đồ mỹ nghệ', count: 4 },
  { id: 'craft', name: 'Đồ thủ công', count: 4 },
  { id: 'lighting', name: 'Đèn & Ánh sáng', count: 2 },
  { id: 'kitchen', name: 'Nhà bếp', count: 2 },
  { id: 'storage', name: 'Lưu trữ', count: 2 }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sofa 2 chỗ Nordic',
    category: 'furniture',
    categoryName: 'Nội thất',
    price: 2990000,
    originalPrice: 3500000,
    image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/sofa-phong-khach-original.webp'
    ],
    rating: 5.0,
    reviewsCount: 42,
    shortDesc: 'Thiết kế tối giản, êm ái phong cách Bắc Âu',
    description: 'Sofa 2 chỗ Nordic mang phong cách thiết kế Scandinavia hiện đại, đường nét tinh tế, đệm mút cao cấp đàn hồi cao bọc vải nỉ cao cấp thoáng khí, khung gỗ tự nhiên chống mối mọt chắc chắn.',
    stock: 18,
    isFeatured: true,
    isNew: true,
    badge: 'Mới',
    specs: {
      material: 'Vải nỉ cao cấp, khung gỗ thông tự nhiên',
      color: 'Xám sáng Nordic',
      dimensions: 'Dài 160cm x Sâu 80cm x Cao 78cm',
      weight: '32 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 2,
    name: 'Bàn ăn gỗ Sồi',
    category: 'furniture',
    categoryName: 'Nội thất',
    price: 3490000,
    originalPrice: 4200000,
    image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/bo-ban-an-go-original.webp'
    ],
    rating: 4.9,
    reviewsCount: 38,
    shortDesc: 'Gỗ sồi tự nhiên, bền đẹp vân gỗ sang trọng',
    description: 'Bộ bàn ăn làm từ 100% gỗ sồi tự nhiên được xử lý sấy kỹ thuật chống cong vênh, mối mọt. Lớp sơn phủ PU mờ bảo vệ tối đa vân gỗ tự nhiên, tạo cảm giác ấm cúng cho bữa cơm gia đình.',
    stock: 12,
    isFeatured: true,
    isNew: true,
    badge: 'Bán chạy',
    specs: {
      material: 'Gỗ sồi nhập khẩu nguyên khối',
      color: 'Gỗ tự nhiên (Natural Oak)',
      dimensions: 'Dài 140cm x Rộng 75cm x Cao 75cm',
      weight: '28 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 3,
    name: 'Đèn thả trần Minimal',
    category: 'lighting',
    categoryName: 'Đèn & Ánh sáng',
    price: 599000,
    originalPrice: 750000,
    image: '/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/den-tre-thu-cong-original.webp'
    ],
    rating: 4.8,
    reviewsCount: 29,
    shortDesc: 'Ánh sáng dịu nhẹ, kết hợp gỗ & kim loại tinh tế',
    description: 'Đèn thả trần Minimal kết hợp chao đèn kim loại sơn tĩnh điện và chóp gỗ tự nhiên. Cho góc chiếu sáng tập trung, tạo điểm nhấn hoàn hảo cho bàn ăn, quầy bar hoặc góc đọc sách.',
    stock: 25,
    isFeatured: true,
    isNew: false,
    badge: '-20%',
    specs: {
      material: 'Hợp kim nhôm sơn tĩnh điện + Gỗ sồi',
      color: 'Trắng sứ & Gỗ sáng',
      dimensions: 'Đường kính 30cm, Dây treo 1.2m điều chỉnh',
      weight: '1.2 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 4,
    name: 'Bình gốm Decor',
    category: 'decor',
    categoryName: 'Đồ mỹ nghệ',
    price: 290000,
    originalPrice: 350000,
    image: '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/binh-gom-trang-tri-original.webp'
    ],
    rating: 5.0,
    reviewsCount: 56,
    shortDesc: 'Gốm sứ cao cấp, trang nhã tinh khôi',
    description: 'Bình gốm sứ mỹ nghệ tráng men mờ thủ công. Thích hợp cắm hoa tươi, cành lá trang trí hoặc bày kệ tủ tạo điểm nhấn trang nhã cho phòng khách, bàn làm việc.',
    stock: 40,
    isFeatured: true,
    isNew: false,
    badge: 'Hot',
    specs: {
      material: 'Gốm nung nhiệt độ cao men mờ',
      color: 'Trắng be ngà',
      dimensions: 'Cao 22cm x Bầu 15cm x Miệng 8cm',
      weight: '0.8 kg',
      origin: 'Bát Tràng, Việt Nam'
    }
  },
  {
    id: 5,
    name: 'Kệ gỗ đa năng',
    category: 'storage',
    categoryName: 'Lưu trữ',
    price: 1293000,
    originalPrice: 1550000,
    image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/ke-go-trang-tri-original.webp'
    ],
    rating: 4.7,
    reviewsCount: 19,
    shortDesc: 'Tiết kiệm không gian, thiết kế phân tầng thông minh',
    description: 'Kệ gỗ 4 tầng đa năng bằng gỗ cao su tự nhiên bền chắc, các góc cạnh bo tròn an toàn. Phù hợp để sách báo, đồ trang trí, chậu cây cảnh hoặc vật dụng gia đình.',
    stock: 9,
    isFeatured: true,
    isNew: false,
    badge: 'Sắp hết',
    specs: {
      material: 'Gỗ cao su tự nhiên ghép thanh',
      color: 'Gỗ vàng sáng tự nhiên',
      dimensions: 'Rộng 60cm x Sâu 30cm x Cao 120cm',
      weight: '9.5 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 6,
    name: 'Giỏ mây lưu trữ',
    category: 'craft',
    categoryName: 'Đồ thủ công',
    price: 199000,
    originalPrice: 260000,
    image: '/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/gio-may-dan-original.webp'
    ],
    rating: 4.9,
    reviewsCount: 64,
    shortDesc: 'Thân thiện, tiện dụng đan tay truyền thống',
    description: 'Giỏ mây đan thủ công từ sợi mây tự nhiên đã qua xử lý chống ẩm mốc. Thiết kế có tay cầm tiện lợi, dùng để chứa đồ chơi, quần áo gọn gàng hoặc làm phụ kiện chụp ảnh phong cách mộc mạc.',
    stock: 7,
    isFeatured: true,
    isNew: false,
    badge: 'Thủ công',
    specs: {
      material: 'Mây tự nhiên 100% đan tay',
      color: 'Vàng rơm tự nhiên',
      dimensions: 'Dài 38cm x Rộng 28cm x Cao 20cm',
      weight: '0.6 kg',
      origin: 'Làng nghề mây tre đan Phú Vinh, Việt Nam'
    }
  },
  {
    id: 7,
    name: 'Bộ bình gốm Minimal Style',
    category: 'decor',
    categoryName: 'Đồ mỹ nghệ',
    price: 499000,
    originalPrice: 699000,
    image: '/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/bo-binh-gom-minimal-original.webp'
    ],
    rating: 5.0,
    reviewsCount: 48,
    shortDesc: 'Bộ 3 bình gốm vân rãnh tối giản sang trọng',
    description: 'Set 3 bình gốm nghệ thuật dáng thấp và cao phối màu Pastel hiện đại (kem, xanh olive, trắng). Tạo chiều sâu kiến trúc tinh tế khi bày trí trên kệ tủ phòng khách.',
    stock: 15,
    isFeatured: false,
    isNew: true,
    badge: '-29%',
    specs: {
      material: 'Gốm nung men sần cao cấp',
      color: 'Beige, Green Olive, White',
      dimensions: 'Bình lớn: 20cm, Bình trung: 15cm, Bình nhỏ: 10cm',
      weight: '1.4 kg (bộ 3 cái)',
      origin: 'Bát Tràng, Việt Nam'
    }
  },
  {
    id: 8,
    name: 'Tranh treo Macrame thủ công',
    category: 'craft',
    categoryName: 'Đồ thủ công',
    price: 450000,
    originalPrice: 550000,
    image: '/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/tranh-treo-macrame-original.webp'
    ],
    rating: 4.9,
    reviewsCount: 31,
    shortDesc: 'Dệt sợi cotton tự nhiên phong cách Bohemian',
    description: 'Tranh treo tường Macrame đan tay từ sợi cotton xoắn mềm mại trên thanh gỗ mộc tự nhiên. Mang đến phong cách nghệ thuật Boho lãng mạn và ấm cúng cho không gian.',
    stock: 14,
    isFeatured: false,
    isNew: true,
    badge: 'Boho Art',
    specs: {
      material: 'Sợi Cotton tự nhiên + Cành gỗ mộc',
      color: 'Trắng kem tự nhiên',
      dimensions: 'Rộng 45cm x Dài thả 75cm',
      weight: '0.7 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 9,
    name: 'Khay gỗ họa tiết khắc Laser',
    category: 'craft',
    categoryName: 'Đồ thủ công',
    price: 250000,
    originalPrice: 300000,
    image: '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/khay-go-hoa-van-original.webp'
    ],
    rating: 4.8,
    reviewsCount: 22,
    shortDesc: 'Khay gỗ xà cừ khắc hoa văn kỷ hà độc đáo',
    description: 'Khay gỗ tròn đa dụng chạm khắc hoa văn tinh xảo, thích hợp làm khay trà, đĩa bánh ngọt hoặc lót nến thơm trang trí.',
    stock: 22,
    isFeatured: false,
    isNew: false,
    badge: 'Mới',
    specs: {
      material: 'Gỗ xà cừ nguyên khối',
      color: 'Nâu cánh gián tự nhiên',
      dimensions: 'Đường kính 28cm x Cao 2.5cm',
      weight: '0.5 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 10,
    name: 'Đèn lồng tre nghệ thuật',
    category: 'lighting',
    categoryName: 'Đèn & Ánh sáng',
    price: 380000,
    originalPrice: 480000,
    image: '/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/den-long-tre-original.webp'
    ],
    rating: 4.7,
    reviewsCount: 17,
    shortDesc: 'Nan tre uốn thủ công, bóng đổ lung linh',
    description: 'Chao đèn lồng tre đan tạo hiệu ứng ánh sáng nan tre ấm áp huyền ảo khi thắp sáng trong phòng khách hoặc ban công.',
    stock: 16,
    isFeatured: false,
    isNew: false,
    badge: 'Thủ công',
    specs: {
      material: 'Tre già xử lý hun khói',
      color: 'Nâu tre hun khói',
      dimensions: 'Đường kính 35cm x Cao 40cm',
      weight: '0.8 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 11,
    name: 'Chậu cây để bàn Decor',
    category: 'furniture',
    categoryName: 'Nội thất',
    price: 185000,
    originalPrice: 220000,
    image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/chau-cay-de-ban-original.webp'
    ],
    rating: 4.9,
    reviewsCount: 45,
    shortDesc: 'Gốm tráng men kèm chân đế gỗ sồi mộc mạc',
    description: 'Chậu cây mini để bàn làm việc, phòng ngủ tạo không gian xanh mát và cảm giác thư giãn cho gia chủ.',
    stock: 30,
    isFeatured: false,
    isNew: false,
    badge: 'Xanh mát',
    specs: {
      material: 'Gốm trắng + Đế gỗ sồi tự nhiên',
      color: 'Trắng mờ & Gỗ',
      dimensions: 'Đường kính 14cm x Cao 16cm (cả đế)',
      weight: '0.6 kg',
      origin: 'Việt Nam'
    }
  },
  {
    id: 12,
    name: 'Khay gỗ chữ nhật tay cầm',
    category: 'craft',
    categoryName: 'Đồ thủ công',
    price: 320000,
    originalPrice: 390000,
    image: '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp',
    gallery: [
      '/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp',
      '/MiniShop_Assets/assets/images/products/San_pham/khay-go-trang-tri-original.webp'
    ],
    rating: 4.8,
    reviewsCount: 27,
    shortDesc: 'Thiết kế chữ nhật tối giản, tiện dụng phục vụ',
    description: 'Khay phục vụ bằng gỗ tự nhiên chống thấm nước, tay cầm khoét rãnh mượt mà, tiện lợi cho việc bưng trà bánh hoặc trang trí bàn trà.',
    stock: 18,
    isFeatured: false,
    isNew: false,
    badge: 'Tiện ích',
    specs: {
      material: 'Gỗ sồi tự nhiên',
      color: 'Gỗ tự nhiên vân sáng',
      dimensions: 'Dài 40cm x Rộng 25cm x Cao 4cm',
      weight: '0.9 kg',
      origin: 'Việt Nam'
    }
  }
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'MS-89101',
    customerName: 'Nguyễn Văn An',
    phone: '0912 345 678',
    email: 'nguyenvanan@gmail.com',
    address: '123 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    items: [
      { id: 1, name: 'Sofa 2 chỗ Nordic', price: 2990000, quantity: 1, image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp' },
      { id: 4, name: 'Bình gốm Decor', price: 290000, quantity: 2, image: '/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp' }
    ],
    totalAmount: 3570000,
    shippingFee: 0,
    status: 'COMPLETED',
    statusText: 'Hoàn thành',
    paymentMethod: 'COD',
    createdAt: '2025-05-28 14:30'
  },
  {
    id: 'MS-89102',
    customerName: 'Trần Thị Mai',
    phone: '0987 654 321',
    email: 'mai.tran@gmail.com',
    address: '45 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    items: [
      { id: 2, name: 'Bàn ăn gỗ Sồi', price: 3490000, quantity: 1, image: '/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp' }
    ],
    totalAmount: 3490000,
    shippingFee: 0,
    status: 'SHIPPING',
    statusText: 'Đang giao hàng',
    paymentMethod: 'BANK_TRANSFER',
    createdAt: '2025-05-29 09:15'
  }
];

export const DEFAULT_USERS: User[] = [
  { id: 1, name: 'Khách hàng Thân Thiết', email: 'user@minishop.vn', role: 'CUSTOMER', phone: '0912345678' },
  { id: 2, name: 'Quản Trị Viên (MiniShop)', email: 'admin@minishop.vn', role: 'ADMIN', phone: '0999888777' },
  { id: 3, name: 'Quản Trị Viên Sao Việt', email: 'admin@tinhocsaoviet.com', role: 'ADMIN', phone: '0933108888' }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 1,
    userName: 'Hoàng Long',
    userEmail: 'hoanglong@gmail.com',
    rating: 5,
    comment: 'Sofa rất êm ái, màu xám nhạt phong cách Bắc Âu nhìn rất sang trọng. Giao hàng cẩn thận đóng gói kỹ càng!',
    createdAt: '2025-05-25 10:30'
  },
  {
    id: 'rev-002',
    productId: 1,
    userName: 'Thu Trang',
    userEmail: 'thutrang.tran@gmail.com',
    rating: 5,
    comment: 'Khung gỗ chắc nịch, nệm đàn hồi tốt không bị lún xẹp. Rất ưng ý với mức giá này!',
    createdAt: '2025-05-26 14:15'
  },
  {
    id: 'rev-003',
    productId: 2,
    userName: 'Văn Thắng',
    userEmail: 'thang.van@gmail.com',
    rating: 5,
    comment: 'Bàn ăn gỗ sồi vân tự nhiên cực đẹp, bề mặt sơn PU mờ sờ rất mịn tay. Gia đình mình rất thích!',
    createdAt: '2025-05-27 16:45'
  },
  {
    id: 'rev-004',
    productId: 4,
    userName: 'Minh Hằng',
    userEmail: 'minhhang.decor@gmail.com',
    rating: 5,
    comment: 'Bình gốm mộc tráng men tuyệt đẹp, cắm hoa baby hay hoa khô bày phòng khách siêu xinh!',
    createdAt: '2025-05-28 09:20'
  }
];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: 'SAOVIET20',
    discountPercent: 20,
    maxDiscount: 500000,
    minOrderValue: 500000,
    description: 'Giảm 20% tối đa 500.000đ cho đơn từ 500k từ Sao Việt',
    isActive: true
  },
  {
    code: 'MINI10',
    discountPercent: 10,
    maxDiscount: 200000,
    minOrderValue: 200000,
    description: 'Giảm 10% tối đa 200.000đ cho mọi đơn hàng',
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountPercent: 0,
    maxDiscount: 30000,
    minOrderValue: 300000,
    description: 'Miễn phí vận chuyển toàn quốc cho đơn từ 300k',
    isActive: true
  }
];

