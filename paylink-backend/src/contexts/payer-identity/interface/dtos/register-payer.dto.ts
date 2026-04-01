import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterPayerDto {
  @ApiProperty({ example: 'payer@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+265999000001',
    description: 'E.164 format phone number',
  })
  @IsString()
  @Matches(/^\+\d{10,15}$/, {
    message: 'msisdn must be in E.164 format e.g. +265999000001',
  })
  msisdn!: string;
}
