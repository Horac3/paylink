import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { PrismaService } from '../prisma.service';

describe('Database Integration', () => {
  let module: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('PrismaService is defined', () => {
    expect(prisma).toBeDefined();
  });

  it('can disconnect without error', async () => {
    expect(async () => {
      await prisma.$disconnect();
    }).not.toThrow();
  });
});
