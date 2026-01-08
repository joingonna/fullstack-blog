import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. 开启全局路由前缀，这样所有接口都会变成 http://localhost:3001/api/...
  app.setGlobalPrefix('api');
  // 2. 允许跨域 (CORS)，这样前端 Next.js (3000) 才能调用后端 (3001)
  app.enableCors();

  // 3. 修改端口为 3001
  await app.listen(3001);
}
bootstrap();
