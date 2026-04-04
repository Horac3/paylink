import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ enum: ['INVOICE', 'SUBSCRIPTION', 'DONATION', 'REQUEST'] })
  @IsIn(['INVOICE', 'SUBSCRIPTION', 'DONATION', 'REQUEST'])
  type!: 'INVOICE' | 'SUBSCRIPTION' | 'DONATION' | 'REQUEST';

  @ApiPropertyOptional({ example: '5000.00' })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty({ example: 'MWK', default: 'MWK' })
  @IsString()
  currency: string = 'MWK';

  @ApiPropertyOptional({ enum: ['WEEKLY', 'MONTHLY'] })
  @IsOptional()
  @IsIn(['WEEKLY', 'MONTHLY'])
  recurrenceInterval?: 'WEEKLY' | 'MONTHLY';

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCycles?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description:
      'Payer mobile number in E.164 format. If provided, a pre-filled payment link is generated — the STK push fires automatically when the payer opens the link, no number entry needed.',
    example: '+265881234567',
  })
  @IsOptional()
  @IsString()
  recipientMsisdn?: string;

  @ApiPropertyOptional({
    description: 'MNO provider code. Auto-detected from MSISDN prefix if omitted.',
    example: 'AIRTEL_MALAWI',
  })
  @IsOptional()
  @IsString()
  providerCode?: string;
}
