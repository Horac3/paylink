import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { EmailService } from './email/email.service';

/**
 * @description Global infrastructure module
 */
@Module({
  imports: [DatabaseModule, FirebaseModule],
  providers: [EmailService],
  exports: [DatabaseModule, FirebaseModule, EmailService],
})
export class InfrastructureModule {}
