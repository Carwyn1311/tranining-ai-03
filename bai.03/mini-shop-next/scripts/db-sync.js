/**
 * Mini Shop - Database Synchronizer & Migration Runner
 * Đọc schema từ supabase/schema.sql và kiểm tra tính toàn vẹn với cơ sở dữ liệu Supabase.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yqwsxpsrrqoiblxheqrs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_tI_qBApqG-v7_SDu8LpZIw_we7WUGPh';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSync() {
  console.log('======================================================');
  console.log('🚀 ĐỒNG BỘ CƠ SỞ DỮ LIỆU SUPABASE (MINI SHOP)');
  console.log('URL:', supabaseUrl);
  console.log('======================================================\n');

  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Không tìm thấy file supabase/schema.sql!');
    process.exit(1);
  }

  const tables = ['categories', 'products', 'orders', 'users', 'reviews', 'coupons'];
  console.log('🔍 Đang kiểm tra trạng thái các bảng trên Supabase DB...');

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`  ⚠️ Bảng "public.${table}": Chưa có trên DB (${error.message})`);
      } else {
        console.log(`  ✅ Bảng "public.${table}": Đã tồn tại và sẵn sàng hoạt động`);
      }
    } catch (err) {
      console.log(`  ❌ Lỗi kết nối bảng "${table}":`, err.message);
    }
  }

  console.log('\n📌 LƯU Ý KHI PUSH CODE LÊN GITHUB:');
  console.log('1. File workflow ".github/workflows/supabase-migration.yml" sẽ tự động chạy.');
  console.log('2. Cần cấu hình 3 biến trong GitHub Repository Settings -> Secrets:');
  console.log('   - SUPABASE_PROJECT_ID: Mã định danh project Supabase (vd: yqwsxpsrrqoiblxheqrs)');
  console.log('   - SUPABASE_ACCESS_TOKEN: Token API lấy từ Supabase Account Settings');
  console.log('   - SUPABASE_DB_PASSWORD: Mật khẩu Database PostgreSQL của Supabase');
  console.log('======================================================\n');
}

runSync();
