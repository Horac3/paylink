import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './admin.controller';
import { PaymentModule } from '../contexts/payment/payment.module';

@Module({
  imports: [CqrsModule, PaymentModule],
  controllers: [AdminController],
})
export class AdminModule {}
