import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // 确保能读取 .env

export default defineConfig({
  datasource: {
    // 这里的 url 是给 CLI (Migration) 用的
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});