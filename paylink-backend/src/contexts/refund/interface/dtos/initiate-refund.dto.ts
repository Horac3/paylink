import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class InitiateRefundDto {
  @ApiProperty()
  @IsUUID()
  transactionId!: string;

  @ApiProperty({ example: '500.00' })
  @IsString()
  amount!: string;

  @ApiProperty({ example: 'Customer requested refund' })
  @IsString()
  @MinLength(3)
  reason!: string;
}
