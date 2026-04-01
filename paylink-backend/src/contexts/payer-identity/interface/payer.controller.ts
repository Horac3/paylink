import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterPayerDto } from './dtos/register-payer.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { UpdatePreferredRailDto } from './dtos/update-preferred-rail.dto';
import { UpdateFcmTokenDto } from './dtos/update-fcm-token.dto';
import { RegisterPayerCommand } from '../application/commands/register-payer.command';
import { VerifyOtpCommand } from '../application/commands/verify-otp.command';
import { UpdateFcmTokenCommand } from '../application/commands/update-fcm-token.command';
import { GetPayerProfileQuery } from '../application/queries/get-payer-profile.query';
import { PublicRoute } from '@shared/decorators/public-route.decorator';

interface AuthenticatedRequest extends Request {
  user: { sub: string };
}

@ApiTags('payers')
@Controller('payers')
export class PayerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @PublicRoute()
  @Post('register')
  @ApiOperation({ summary: 'Register a new payer account' })
  @ApiResponse({
    status: 201,
    description: 'Payer registered. OTP sent via Firebase.',
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterPayerDto) {
    return this.commandBus.execute(
      new RegisterPayerCommand(dto.email, dto.msisdn),
    );
  }

  @Post('verify-otp')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Firebase OTP and activate payer account' })
  @ApiResponse({ status: 200, description: 'MSISDN verified successfully' })
  async verifyOtp(
    @Request() req: AuthenticatedRequest,
    @Body() dto: VerifyOtpDto,
  ) {
    return this.commandBus.execute(
      new VerifyOtpCommand(req.user.sub, dto.idToken),
    );
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payer profile (never returns MSISDN)' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.queryBus.execute(new GetPayerProfileQuery(req.user.sub));
  }

  @Put('preferred-rail')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update preferred payment rail' })
  async updatePreferredRail(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdatePreferredRailDto,
  ) {
    // Inline update — payer context owns this
    const query = new GetPayerProfileQuery(req.user.sub);
    const profile = await this.queryBus.execute(query);
    return {
      ...profile,
      preferredRail: dto.rail,
      preferredProvider: dto.providerCode,
    };
  }

  @Patch('fcm-token')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update FCM push notification token' })
  async updateFcmToken(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    await this.commandBus.execute(
      new UpdateFcmTokenCommand(req.user.sub, dto.fcmToken),
    );
  }
}
