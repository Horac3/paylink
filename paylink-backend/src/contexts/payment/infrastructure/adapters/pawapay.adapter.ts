import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  IRailAdapter,
  RailDepositParams,
  RailDepositResult,
  RailPayoutParams,
  RailPayoutResult,
  RailRefundParams,
  RailRefundResult,
  RailDepositStatusResult,
  RailRefundStatus,
  RailAvailability,
} from '../../domain/ports/rail-adapter.interface';
import {
  RailUnavailableError,
  RailRejectedError,
  RailTimeoutError,
  RailAuthError,
} from '@shared/errors/rail-errors';

/**
 * @description PawaPay V2 API adapter implementing IRailAdapter.
 * All config from env vars — never hardcoded.
 * @see https://docs.pawapay.io/
 */
@Injectable()
export class PawaPayAdapter implements IRailAdapter {
  readonly railId = 'PAWAPAY';
  private readonly logger = new Logger(PawaPayAdapter.name);
  private readonly http: AxiosInstance;

  constructor(config: ConfigService) {
    this.http = axios.create({
      baseURL: config.getOrThrow<string>('PAWAPAY_BASE_URL'),
      timeout: 30000,
    });

    this.http.interceptors.request.use((req) => {
      req.headers['Authorization'] =
        `Bearer ${config.getOrThrow<string>('PAWAPAY_API_TOKEN')}`;
      this.logger.debug(`[PAWAPAY] ${req.method?.toUpperCase()} ${req.url}`);
      return req;
    });

    this.http.interceptors.response.use(
      (res) => {
        this.logger.debug(`[PAWAPAY] ${res.status} ${res.config.url}`);
        return res;
      },
      (err: AxiosError) => {
        this.logger.error(
          `[PAWAPAY] Error ${err.response?.status}: ${err.message}`,
        );
        return Promise.reject(err);
      },
    );
  }

  /**
   * @description Initiate a deposit (STK push) via PawaPay V2.
   * @param params Deposit parameters including depositId as idempotency key
   * @returns RailDepositResult — ACCEPTED means await callback
   * @throws RailAuthError for 401/403
   * @throws RailUnavailableError for 5xx or PROVIDER_TEMPORARILY_UNAVAILABLE
   * @throws RailRejectedError for invalid input failure codes
   * @throws RailTimeoutError for network timeouts
   */
  async initiateDeposit(params: RailDepositParams): Promise<RailDepositResult> {
    try {
      const { data } = await this.http.post('/v2/deposits', {
        depositId: params.depositId,
        amount: params.amount,
        currency: params.currency,
        payer: {
          type: 'MMO',
          accountDetails: {
            provider: params.providerCode,
            phoneNumber: params.phoneNumber,
          },
        },
        clientReferenceId: params.clientReference,
        customerMessage: params.customerMessage,
        metadata: params.metadata,
      });

      return this.mapDepositResponse(data as PawaPayDepositResponse);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async initiatePayout(params: RailPayoutParams): Promise<RailPayoutResult> {
    try {
      const { data } = await this.http.post('/v2/payouts', {
        payoutId: params.payoutId,
        amount: params.amount,
        currency: params.currency,
        recipient: {
          type: 'MMO',
          accountDetails: {
            provider: params.providerCode,
            phoneNumber: params.phoneNumber,
          },
        },
        customerMessage: params.customerMessage,
        metadata: params.metadata,
      });
      const d = data as {
        payoutId: string;
        status: string;
        failureReason?: { failureCode?: string };
      };
      return {
        externalRef: d.payoutId,
        status: d.status as RailPayoutResult['status'],
        failureCode: d.failureReason?.failureCode,
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * @description Initiate a refund for a completed deposit.
   * @param params Refund params — refundId is our UUID (idempotency key)
   */
  async initiateRefund(params: RailRefundParams): Promise<RailRefundResult> {
    try {
      const { data } = await this.http.post('/v2/refunds', {
        refundId: params.refundId,
        depositId: params.depositId,
        amount: params.amount,
        currency: params.currency,
        metadata: params.metadata,
      });
      const d = data as {
        refundId: string;
        status: string;
        failureReason?: { failureCode?: string };
      };
      return {
        externalRef: d.refundId,
        status: d.status as RailRefundResult['status'],
        failureCode: d.failureReason?.failureCode,
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async getDepositStatus(externalRef: string): Promise<RailDepositStatusResult> {
    try {
      const { data } = await this.http.get<{ status: string }>(
        `/v2/deposits/${externalRef}`,
      );
      return { status: this.mapStatus(data.status) };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async getRefundStatus(externalRef: string): Promise<RailRefundStatus> {
    try {
      const { data } = await this.http.get<{ status: string }>(
        `/v2/refunds/${externalRef}`,
      );
      return this.mapStatus(data.status);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async predictProvider(phoneNumber: string): Promise<string | null> {
    try {
      const { data } = await this.http.post<{ providerCode?: string }>(
        '/v2/predict-provider',
        { phoneNumber },
      );
      return data.providerCode ?? null;
    } catch {
      return null;
    }
  }

  async checkAvailability(country: string): Promise<RailAvailability> {
    try {
      const { data } = await this.http.get<{ status: string }>(
        '/v2/availability',
        {
          params: { country, operationType: 'DEPOSIT' },
        },
      );
      return { available: data.status === 'OPERATIONAL' };
    } catch {
      return { available: false, reason: 'Could not reach PawaPay' };
    }
  }

  async getWalletBalances(): Promise<unknown> {
    const { data } = await this.http.get('/v2/wallet-balances', {
      params: { country: 'MWI' },
    });
    return data;
  }

  private mapDepositResponse(data: PawaPayDepositResponse): RailDepositResult {
    return {
      externalRef: data.depositId,
      status: data.status as RailDepositResult['status'],
      failureCode: data.failureReason?.failureCode,
      failureMsg: data.failureReason?.failureMessage,
    };
  }

  private mapStatus(status: string): 'PENDING' | 'COMPLETED' | 'FAILED' {
    if (status === 'COMPLETED') return 'COMPLETED';
    if (status === 'FAILED') return 'FAILED';
    return 'PENDING';
  }

  /**
   * @description Maps PawaPay failure codes and HTTP errors to typed domain rail errors.
   */
  private mapError(err: unknown): Error {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<{
        failureReason?: { failureCode?: string; failureMessage?: string };
      }>;
      const status = axiosErr.response?.status;
      const failureCode = axiosErr.response?.data?.failureReason?.failureCode;

      if (status === 401 || status === 403)
        return new RailAuthError(`Auth error ${status}`, this.railId);
      if (status && status >= 500)
        return new RailUnavailableError(`PawaPay 5xx: ${status}`, this.railId);
      if (axiosErr.code === 'ECONNABORTED')
        return new RailTimeoutError('Request timed out', this.railId);

      if (failureCode)
        return this.mapFailureCode(
          failureCode,
          axiosErr.response?.data?.failureReason?.failureMessage ?? '',
        );
    }
    return new RailUnavailableError(
      `Unknown error: ${(err as Error).message}`,
      this.railId,
    );
  }

  private mapFailureCode(code: string, msg: string): Error {
    switch (code) {
      case 'PROVIDER_TEMPORARILY_UNAVAILABLE':
        return new RailUnavailableError(msg, this.railId);
      case 'UNKNOWN_ERROR':
        return new RailUnavailableError(msg, this.railId);
      case 'AUTHENTICATION_ERROR':
      case 'AUTHORISATION_ERROR':
        return new RailAuthError(msg, this.railId);
      default:
        return new RailRejectedError(code, msg, this.railId);
    }
  }
}

interface PawaPayDepositResponse {
  depositId: string;
  status: string;
  failureReason?: { failureCode?: string; failureMessage?: string };
}
