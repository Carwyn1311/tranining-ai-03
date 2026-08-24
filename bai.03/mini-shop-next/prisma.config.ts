import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres.yqwsxpsrrqoiblxheqrs:training-ai-03-123@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
  },
});
