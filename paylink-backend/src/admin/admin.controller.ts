import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PawaPayAdapter } from '../contexts/payment/infrastructure/adapters/pawapay.adapter';

/**
 * @description Internal admin endpoints — wallet balance monitoring.
 */
@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly pawaPayAdapter: PawaPayAdapter) {}

  @Get('wallet-balances')
  @ApiOperation({ summary: 'Get PawaPay wallet balances (MWI)' })
  async walletBalances() {
    return this.pawaPayAdapter.getWalletBalances();
  }
}
