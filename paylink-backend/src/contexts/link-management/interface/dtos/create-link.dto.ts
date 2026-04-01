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
}
