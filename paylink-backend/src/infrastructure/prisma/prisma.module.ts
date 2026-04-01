import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @description Global Prisma module — PrismaService available everywhere without import.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
