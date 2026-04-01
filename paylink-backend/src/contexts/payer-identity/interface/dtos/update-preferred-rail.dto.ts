import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdatePreferredRailDto {
  @ApiProperty({ example: 'PAWAPAY', enum: ['PAWAPAY', 'TNM', 'AIRTEL'] })
  @IsIn(['PAWAPAY', 'TNM', 'AIRTEL'])
  rail!: string;

  @ApiProperty({ example: 'AIRTEL_MALAWI' })
  @IsString()
  providerCode!: string;
}
