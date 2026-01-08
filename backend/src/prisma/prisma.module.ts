import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- 加上这个，设为全局模块，以后不用到处导入
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- 必须导出
})
export class PrismaModule {}
