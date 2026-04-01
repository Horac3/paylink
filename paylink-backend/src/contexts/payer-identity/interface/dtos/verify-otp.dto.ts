import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Firebase Auth ID token from client after OTP entry',
  })
  @IsString()
  idToken!: string;
}
