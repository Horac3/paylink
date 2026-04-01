import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LinksController } from './interface/links.controller';
import { PayController } from './interface/pay.controller';
import { CreateLinkHandler } from './application/commands/create-link.handler';
import { CancelLinkHandler } from './application/commands/cancel-link.handler';
import { ExpireLinkHandler } from './application/commands/expire-link.handler';
import { ValidateLinkHandler } from './application/queries/validate-link.handler';
import {
  GetLinkHandler,
  GetLinkBySlugHandler,
} from './application/queries/get-link.handler';
import { PrismaLinkRepository } from './infrastructure/prisma-link.repository';
import { SlugGeneratorService } from './infrastructure/slug-generator.service';
import { QrCodeService } from './infrastructure/qr-code.service';
import { LINK_REPOSITORY } from './domain/ports/link-repository.interface';

const CommandHandlers = [
  CreateLinkHandler,
  CancelLinkHandler,
  ExpireLinkHandler,
];
const QueryHandlers = [
  ValidateLinkHandler,
  GetLinkHandler,
  GetLinkBySlugHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [LinksController, PayController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    SlugGeneratorService,
    QrCodeService,
    { provide: LINK_REPOSITORY, useClass: PrismaLinkRepository },
  ],
  exports: [LINK_REPOSITORY, ValidateLinkHandler],
})
export class LinkManagementModule {}
