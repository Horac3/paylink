import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @description Global database module — PrismaService available to all modules
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
