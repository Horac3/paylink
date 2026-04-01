import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { RegisterMerchantCommand } from '../application/commands/register-merchant.command';
import { LoginCommand } from '../application/commands/login.command';
import { RefreshTokenCommand } from '../application/commands/refresh-token.command';
import { GetMerchantQuery } from '../application/queries/get-merchant.query';
import { PublicRoute } from '@shared/decorators/public-route.decorator';
import { CurrentMerchant } from '@shared/decorators/current-merchant.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @PublicRoute()
  @Post('register')
  @ApiOperation({ summary: 'Register a new merchant account' })
  @ApiResponse({ status: 201, description: 'Merchant registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterMerchantCommand(dto.email, dto.businessName, dto.password),
    );
  }

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT token pair' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(dto.email, dto.password));
  }

  @PublicRoute()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New token pair issued' })
  async refresh(@Body() dto: RefreshDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto.refreshToken));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (client should discard tokens)' })
  async logout() {
    // Stateless JWT — client discards tokens. Future: add token denylist.
    return;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current merchant profile' })
  async me(@CurrentMerchant() merchantId: string) {
    return this.queryBus.execute(new GetMerchantQuery(merchantId));
  }
}
