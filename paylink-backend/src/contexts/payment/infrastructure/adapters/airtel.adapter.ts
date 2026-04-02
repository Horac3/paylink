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
import { AirtelSigningService } from './airtel-signing.service';

interface AirtelTokenCache {
  token: string;
  issuedAt: number;
  expiresIn: number; // seconds
}

// Airtel collection response_code → domain error map
const COLLECTION_ERROR_CODES: Record<string, string> = {
  DP00800001002: 'INCORRECT_PIN',
  DP00800001003: 'LIMIT_EXCEEDED',
  DP00800001004: 'INVALID_AMOUNT',
  DP00800001005: 'NO_PIN',
  DP00800001007: 'INSUFFICIENT_BALANCE',
  DP00800001008: 'REFUSED',
  DP00800001010: 'PAYEE_NOT_PERMITTED',
  DP00800001024: 'TIMEOUT',
  DP00800001025: 'UNAVAILABLE',
};

// Airtel disbursement response_code → domain error map
const DISBURSE_ERROR_CODES: Record<string, string> = {
  DP00900001003: 'LIMIT_EXCEEDED',
  DP00900001004: 'INVALID_AMOUNT',
  DP00900001005: 'REFUSED',
  DP00900001007: 'INSUFFICIENT_FUNDS',
  DP00900001009: 'INVALID_PAYEE',
  DP00900001010: 'USER_NOT_ALLOWED',
  DP00900001012: 'INVALID_PHONE',
  DP00900001013: 'REFUSED',
  DP00900001015: 'NOT_FOUND',
  DP00900001017: 'DUPLICATE',
};

/**
 * @description Airtel Money adapter — OAuth2, USSD push, disbursements, RSA signing.
 * Token expires in 180s — refreshed 30s before expiry.
 * Polling-only — no inbound webhook documented.
 */
@Injectable()
export class AirtelAdapter implements IRailAdapter {
  readonly railId = 'AIRTEL';
  private readonly logger = new Logger(AirtelAdapter.name);
  private readonly http: AxiosInstance;

  private tokenCache: AirtelTokenCache | null = null;
  private refreshPromise: Promise<string> | null = null;

  private readonly country: string;
  private readonly currency: string;

  constructor(
    private readonly config: ConfigService,
    private readonly signingService: AirtelSigningService,
  ) {
    this.country = config.get<string>('AIRTEL_COUNTRY', 'MW');
    this.currency = config.get<string>('AIRTEL_CURRENCY', 'MWK');

    this.http = axios.create({
      baseURL: config.getOrThrow<string>('AIRTEL_BASE_URL'),
      timeout: 30000,
      headers: {
        'X-Country': this.country,
        'X-Currency': this.currency,
      },
    });

    this.http.interceptors.response.use(
      (res) => {
        this.logger.debug(`[AIRTEL] ${res.status} ${res.config.url}`);
        return res;
      },
      (err: AxiosError) => {
        this.logger.error(`[AIRTEL] Error ${err.response?.status}: ${err.message}`);
        return Promise.reject(err);
      },
    );
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  private async getToken(): Promise<string> {
    const now = Date.now();
    if (
      this.tokenCache &&
      now < this.tokenCache.issuedAt + (this.tokenCache.expiresIn - 30) * 1000
    ) {
      return this.tokenCache.token;
    }
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.authenticate()
      .then((cache) => {
        this.tokenCache = cache;
        this.refreshPromise = null;
        return cache.token;
      })
      .catch((err) => {
        this.refreshPromise = null;
        throw err;
      });

    return this.refreshPromise;
  }

  private async authenticate(): Promise<AirtelTokenCache> {
    try {
      const { data } = await this.http.post<{
        access_token: string;
        expires_in: string;
        token_type: string;
      }>('/auth/oauth2/token', {
        client_id: this.config.getOrThrow<string>('AIRTEL_CLIENT_ID'),
        client_secret: this.config.getOrThrow<string>('AIRTEL_CLIENT_SECRET'),
        grant_type: 'client_credentials',
      });
      return {
        token: data.access_token,
        issuedAt: Date.now(),
        expiresIn: parseInt(data.expires_in, 10),
      };
    } catch (err) {
      this.logger.error('[RAIL_AUTH_ERROR] Airtel authentication failed', err);
      throw new RailAuthError('Airtel OAuth2 authentication failed', this.railId);
    }
  }

  private authHeader(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  // ─── MSISDN helpers ───────────────────────────────────────────────────────

  /**
   * Airtel requires local format WITHOUT country code — strips +265 or 265 prefix.
   */
  normaliseMsisdn(msisdn: string): string {
    return msisdn.replace(/^(\+265|265)/, '');
  }

  // ─── IRailAdapter ─────────────────────────────────────────────────────────

  /**
   * Initiates Airtel USSD push (collection).
   * HTTP 200 is returned for both success and in-progress — check response_code.
   * @throws RailRejectedError for terminal failure response_codes
   * @throws RailTimeoutError for DP00800001024
   * @throws RailUnavailableError for DP00800001025 or 5xx
   */
  async initiateDeposit(params: RailDepositParams): Promise<RailDepositResult> {
    const token = await this.getToken();
    const msisdn = this.normaliseMsisdn(params.phoneNumber);
    try {
      const { data } = await this.http.post<{
        data: { transaction: { id: string; status: string } };
        status: {
          code: string;
          message: string;
          result_code: string;
          response_code: string;
          success: boolean;
        };
      }>(
        '/merchant/v1/payments/',
        {
          reference: params.customerMessage.slice(0, 50) || 'PayLink payment',
          subscriber: {
            country: this.country,
            currency: this.currency,
            msisdn,
          },
          transaction: {
            amount: Number(params.amount),
            country: this.country,
            currency: this.currency,
            id: params.depositId,
          },
        },
        { headers: this.authHeader(token) },
      );

      const responseCode = data.status?.response_code;

      // Terminal success
      if (responseCode === 'DP00800001001') {
        return { externalRef: params.depositId, status: 'ACCEPTED' };
      }
      // In-process / pending — poll for final status
      if (
        responseCode === 'DP00800001006' ||
        responseCode === 'DP00800001000'
      ) {
        return { externalRef: params.depositId, status: 'ACCEPTED' };
      }
      // Timeout
      if (responseCode === 'DP00800001024') {
        throw new RailTimeoutError('Airtel collection timed out', this.railId);
      }
      // Unavailable
      if (responseCode === 'DP00800001025') {
        throw new RailUnavailableError('Airtel collection unavailable', this.railId);
      }
      // Terminal failure codes
      const failureCode = COLLECTION_ERROR_CODES[responseCode];
      if (failureCode) {
        throw new RailRejectedError(failureCode, data.status.message, this.railId);
      }
      // Unknown response_code — treat as unavailable
      throw new RailUnavailableError(
        `Airtel unknown response_code: ${responseCode}`,
        this.railId,
      );
    } catch (err) {
      if (
        err instanceof RailRejectedError ||
        err instanceof RailTimeoutError ||
        err instanceof RailUnavailableError ||
        err instanceof RailAuthError
      ) {
        throw err;
      }
      throw this.mapError(err);
    }
  }

  /**
   * Airtel disbursement with RSA signing headers.
   * @throws RailAuthError for DP00900001018 (signature mismatch) or DP00900001019
   * @throws RailRejectedError for terminal failure codes
   */
  async initiatePayout(params: RailPayoutParams): Promise<RailPayoutResult> {
    const token = await this.getToken();
    const msisdn = this.normaliseMsisdn(params.phoneNumber);
    const body = {
      payee: {
        msisdn,
        wallet_type: 'SALARY',
      },
      reference: params.payoutId,
      pin: this.config.getOrThrow<string>('AIRTEL_DISBURSE_PIN'),
      transaction: {
        amount: Number(params.amount),
        id: params.payoutId,
        type: 'B2B',
      },
    };

    const signingHeaders = this.signingService.generateDisbursementHeaders(
      body as unknown as Record<string, unknown>,
    );

    try {
      const { data } = await this.http.post<{
        data: { transaction: { id: string; status: string } };
        status: { response_code: string; message: string };
      }>('/standard/v3/disbursements', body, {
        headers: { ...this.authHeader(token), ...signingHeaders },
      });

      const responseCode = data.status?.response_code;

      if (
        responseCode === 'DP00900001001' ||
        responseCode === 'DP00900001006' ||
        responseCode === 'DP00900001000'
      ) {
        return { externalRef: params.payoutId, status: 'ACCEPTED' };
      }
      if (
        responseCode === 'DP00900001018' ||
        responseCode === 'DP00900001019'
      ) {
        this.logger.error(
          `[RAIL_AUTH_ERROR] Airtel disbursement auth error: ${responseCode}`,
        );
        throw new RailAuthError(
          `Airtel disbursement auth error: ${responseCode}`,
          this.railId,
        );
      }
      const failureCode = DISBURSE_ERROR_CODES[responseCode];
      if (failureCode) {
        throw new RailRejectedError(failureCode, data.status.message, this.railId);
      }
      throw new RailUnavailableError(
        `Airtel disbursement unknown response_code: ${responseCode}`,
        this.railId,
      );
    } catch (err) {
      if (
        err instanceof RailRejectedError ||
        err instanceof RailTimeoutError ||
        err instanceof RailUnavailableError ||
        err instanceof RailAuthError
      ) {
        throw err;
      }
      throw this.mapError(err);
    }
  }

  /**
   * Refunds an Airtel transaction using airtel_money_id (externalProviderRef).
   * params.externalProviderRef must be supplied by the caller (from transaction.externalProviderRef).
   */
  async initiateRefund(params: RailRefundParams): Promise<RailRefundResult> {
    if (!params.externalProviderRef) {
      throw new RailRejectedError(
        'MISSING_AIRTEL_MONEY_ID',
        'Airtel refund requires airtel_money_id from the settled transaction',
        this.railId,
      );
    }
    const token = await this.getToken();
    try {
      const { data } = await this.http.post<{
        data: { transaction: { airtel_money_id: string; status: string } };
        status: { message: string; success: boolean };
      }>(
        '/standard/v1/payments/refund',
        { transaction: { airtel_money_id: params.externalProviderRef } },
        { headers: this.authHeader(token) },
      );
      return {
        externalRef: data.data.transaction.airtel_money_id,
        status: 'ACCEPTED',
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * Polls Airtel transaction enquiry endpoint.
   * status "TS" = success, "TF" = failed, "TA" = pending.
   * Stores airtel_money_id as externalProviderRef for future refunds.
   */
  async getDepositStatus(transactionId: string): Promise<RailDepositStatusResult> {
    const token = await this.getToken();
    try {
      const { data } = await this.http.get<{
        data: {
          transaction: {
            airtel_money_id: string;
            id: string;
            message: string;
            status: string;
          };
        };
        status: { code: string; response_code: string; success: boolean };
      }>(`/standard/v1/payments/${transactionId}`, {
        headers: this.authHeader(token),
      });

      const txnStatus = data.data?.transaction?.status;
      const airtelMoneyId = data.data?.transaction?.airtel_money_id;

      if (txnStatus === 'TS') {
        return {
          status: 'COMPLETED',
          externalProviderRef: airtelMoneyId,
        };
      }
      if (txnStatus === 'TF') {
        return { status: 'FAILED' };
      }
      // TA or anything else — still pending
      return { status: 'PENDING' };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * Airtel refunds are synchronous — once accepted, the refund is complete.
   */
  async getRefundStatus(_externalRef: string): Promise<RailRefundStatus> {
    return 'COMPLETED';
  }

  /**
   * Airtel does not provide a subscriber validation endpoint.
   * Returns 'AIRTEL' for MSISDNs starting with known Airtel prefixes.
   */
  async predictProvider(phoneNumber: string): Promise<string | null> {
    const local = phoneNumber.replace(/^(\+265|265)/, '');
    const airtelPrefixes = ['75', '76', '77', '78', '97'];
    return airtelPrefixes.some((p) => local.startsWith(p)) ? 'AIRTEL' : null;
  }

  async checkAvailability(_country: string): Promise<RailAvailability> {
    try {
      await this.getToken();
      return { available: true };
    } catch {
      return { available: false, reason: 'Airtel authentication failed' };
    }
  }

  // ─── Error mapping ────────────────────────────────────────────────────────

  private mapError(err: unknown): Error {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        this.logger.error(`[RAIL_AUTH_ERROR] Airtel ${status}`);
        return new RailAuthError(`Airtel auth error ${status}`, this.railId);
      }
      if (status && status >= 500) {
        return new RailUnavailableError(`Airtel ${status}`, this.railId);
      }
      if (err.code === 'ECONNABORTED') {
        return new RailTimeoutError('Airtel request timed out', this.railId);
      }
    }
    return new RailUnavailableError(
      `Airtel unknown error: ${(err as Error).message}`,
      this.railId,
    );
  }
}
