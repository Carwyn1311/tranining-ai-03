-- ==========================================================
-- SUPABASE MIGRATION: FULL E-COMMERCE SCHEMA (MINI SHOP)
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
    user_id TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    note TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    status TEXT DEFAULT 'PROCESSING',
    status_text TEXT DEFAULT 'Đang xử lý',
    payment_method TEXT DEFAULT 'COD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG ĐÁNH GIÁ SẢN PHẨM (reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG MÃ GIẢM GIÁ / KHUYẾN MÃI (coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount_percent NUMERIC NOT NULL DEFAULT 0,
    max_discount NUMERIC,
    min_order_value NUMERIC,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- THIẾT LẬP KHÓA AN TOÀN RLS (ROW LEVEL SECURITY)
-- ==========================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'ADMIN'
    OR COALESCE(auth.jwt() ->> 'email', '') ILIKE 'admin@%'
    OR COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.coupons TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public categories read" ON public.categories;
DROP POLICY IF EXISTS "Admin categories manage" ON public.categories;
DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Admin products manage" ON public.products;
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
DROP POLICY IF EXISTS "Admin orders manage" ON public.orders;
DROP POLICY IF EXISTS "User orders read own" ON public.orders;
DROP POLICY IF EXISTS "Admin users manage" ON public.users;
DROP POLICY IF EXISTS "User users read own" ON public.users;
DROP POLICY IF EXISTS "Public reviews read" ON public.reviews;
DROP POLICY IF EXISTS "Public reviews insert" ON public.reviews;
DROP POLICY IF EXISTS "Admin reviews manage" ON public.reviews;
DROP POLICY IF EXISTS "Public coupons read" ON public.coupons;
DROP POLICY IF EXISTS "Admin coupons manage" ON public.coupons;

CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin categories manage" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin products manage" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public orders insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin orders manage" ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "User orders read own" ON public.orders FOR SELECT USING (
  public.is_admin() 
  OR (auth.jwt() ->> 'email' = email)
);

CREATE POLICY "Admin users manage" ON public.users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "User users read own" ON public.users FOR SELECT USING (
  public.is_admin() 
  OR (auth.jwt() ->> 'email' = email)
);

CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public reviews insert" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reviews manage" ON public.reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public coupons read" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin coupons manage" ON public.coupons FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
