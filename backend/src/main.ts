import 'dotenv/config'; // 最优先加载 .env
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  // 【核心修复】在这里解决 "找不到数据库文件" 的问题
  // 1. 获取 dev.db 的绝对路径 (backend 根目录下)
  const dbPath = path.join(process.cwd(), 'dev.db');

  // 2. 强行覆盖环境变量，加上 file: 前缀
  process.env.DATABASE_URL = `file:${dbPath}`;

  console.log(`[Database] Using DB at: ${process.env.DATABASE_URL}`);

  const app = await NestFactory.create(AppModule);

  // 全局验证管道 - 启用 DTO 验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉 DTO 中未定义的属性
      transform: true, // 自动转换类型
      forbidNonWhitelisted: true, // 如果传入未定义的属性则报错
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
