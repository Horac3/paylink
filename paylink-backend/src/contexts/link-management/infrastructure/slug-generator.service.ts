import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Slug } from '../domain/slug.vo';

const CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

/**
 * @description Generates unique 8-character URL-safe slugs, checks DB for collision.
 */
@Injectable()
export class SlugGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(): Promise<Slug> {
    let attempts = 0;
    while (attempts < 10) {
      const raw = Array.from(
        { length: 8 },
        () => CHARS[Math.floor(Math.random() * CHARS.length)],
      ).join('');
      const existing = await this.prisma.paymentLink.findUnique({
        where: { slug: raw },
      });
      if (!existing) return Slug.of(raw);
      attempts++;
    }
    throw new Error('Failed to generate unique slug after 10 attempts');
  }
}
