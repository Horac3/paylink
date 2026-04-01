import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { VerifyOtpCommand } from './verify-otp.command';
import {
  IPayerRepository,
  PAYER_REPOSITORY,
} from '../../domain/ports/payer-repository.interface';
import { FirebaseOtpService } from '../../../../infrastructure/firebase/firebase-otp.service';
import { MsisdnEncryptionService } from '../../infrastructure/msisdn-encryption.service';
import { NotFoundError } from '@shared/errors/not-found.error';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';
import { PayerId } from '@shared/domain/payer-id.vo';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  private readonly logger = new Logger(VerifyOtpHandler.name);

  constructor(
    @Inject(PAYER_REPOSITORY) private readonly repo: IPayerRepository,
    private readonly firebaseOtp: FirebaseOtpService,
    private readonly encryption: MsisdnEncryptionService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: VerifyOtpCommand): Promise<{ verified: boolean }> {
    const payer = await this.repo.findById(PayerId.create(cmd.payerId));
    if (!payer) throw new NotFoundError('PayerAccount', cmd.payerId);

    // Verify Firebase ID token — extracts phone number
    const phoneFromToken = await this.firebaseOtp.verifyIdToken(cmd.idToken);

    // Decrypt stored MSISDN to compare (only allowed usage of decrypt outside ResolvePayerHandler)
    const storedMsisdn = this.encryption.decrypt(payer.msisdnEncrypted);
    const normalised = phoneFromToken.replace(/\s/g, '');
    if (storedMsisdn !== normalised) {
      throw new UnauthorisedError(
        'Phone number does not match registered MSISDN',
      );
    }

    payer.markVerified();
    await this.repo.save(payer);

    for (const event of payer.domainEvents) {
      this.eventBus.publish(event);
    }
    payer.clearEvents();

    this.logger.log(`Payer verified: ${payer.id.value}`);
    return { verified: true };
  }
}
