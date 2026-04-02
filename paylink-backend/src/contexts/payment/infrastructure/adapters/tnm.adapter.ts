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

interface TnmTokenCache {
  token: string;
  expiresAt: Date;
}

/**
 * @description TNM Mpamba adapter — Invoicing (USSD Push) flow.
 * Uses short-lived tokens refreshed 60s before expiry.
 * Polling-only — no inbound webhook from TNM.
 */
@Injectable()
export class TnmAdapter implements IRailAdapter {
  readonly railId = 'TNM';
  private readonly logger = new Logger(TnmAdapter.name);
  private readonly http: AxiosInstance;

  private tokenCache: TnmTokenCache | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: config.getOrThrow<string>('TNM_BASE_URL'),
      timeout: 30000,
    });

    this.http.interceptors.response.use(
      (res) => {
        this.logger.debug(`[TNM] ${res.status} ${res.config.url}`);
        return res;
      },
      (err: AxiosError) => {
        this.logger.error(`[TNM] Error ${err.response?.status}: ${err.message}`);
        return Promise.reject(err);
      },
    );
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  private async getToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && now < this.tokenCache.expiresAt.getTime() - 60_000) {
      return this.tokenCache.token;
    }
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.authenticate()
      .then(({ token, expiresAt }) => {
        this.tokenCache = { token, expiresAt };
        this.refreshPromise = null;
        return token;
      })
      .catch((err) => {
        this.refreshPromise = null;
        throw err;
      });

    return this.refreshPromise;
  }

  private async authenticate(): Promise<{ token: string; expiresAt: Date }> {
    try {
      const { data } = await this.http.post<{
        message: string;
        data: { token: string; expires_at: string };
      }>('/authenticate', {
        wallet: this.config.getOrThrow<string>('TNM_WALLET'),
        password: this.config.getOrThrow<string>('TNM_PASSWORD'),
      });
      const expiresAt = new Date(data.data.expires_at);
      return { token: data.data.token, expiresAt };
    } catch (err) {
      this.logger.error('[RAIL_AUTH_ERROR] TNM authentication failed', err);
      throw new RailAuthError('TNM authentication failed', this.railId);
    }
  }

  private authHeader(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  // ─── MSISDN helpers ───────────────────────────────────────────────────────

  /** Ensure MSISDN is in E.164 format with 265 prefix for TNM. */
  private normaliseMsisdn(msisdn: string): string {
    const stripped = msisdn.replace(/^\+/, '');
    if (stripped.startsWith('265')) return stripped;
    return `265${stripped}`;
  }

  // ─── IRailAdapter ─────────────────────────────────────────────────────────

  /**
   * Issues a TNM invoice (USSD push). 202 = accepted → poll for status.
   * @throws RailRejectedError for 400 validation errors
   * @throws RailAuthError for 401
   * @throws RailUnavailableError for 5xx
   * @throws RailTimeoutError for network timeout
   */
  async initiateDeposit(params: RailDepositParams): Promise<RailDepositResult> {
    const token = await this.getToken();
    try {
      await this.http.post(
        '/invoices',
        {
          invoice_number: params.depositId,
          amount: Number(params.amount),
          msisdn: this.normaliseMsisdn(params.phoneNumber),
          description: params.customerMessage.slice(0, 50) || 'PayLink payment',
        },
        { headers: this.authHeader(token) },
      );
      // 202 Accepted — polling will resolve the final status
      return { externalRef: params.depositId, status: 'ACCEPTED' };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * Initiates a TNM disbursement (merchant → customer).
   * Amount is a string per TNM payout spec.
   */
  async initiatePayout(params: RailPayoutParams): Promise<RailPayoutResult> {
    const token = await this.getToken();
    try {
      const { data } = await this.http.post<{
        data: { transaction_id: string; receipt_number: string };
      }>(
        '/payments',
        {
          msisdn: params.phoneNumber,
          amount: params.amount,
          transaction_id: params.payoutId,
          narration: params.customerMessage,
        },
        { headers: this.authHeader(token) },
      );
      return {
        externalRef: data.data.transaction_id,
        status: 'ACCEPTED',
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * Refunds a settled TNM invoice using its receipt_number.
   * params.receiptNumber must be supplied by the caller (from transaction.receiptNumber).
   * @throws RailRejectedError if receipt_number is missing or invoice not found
   * @throws RailUnavailableError for 503
   */
  async initiateRefund(params: RailRefundParams): Promise<RailRefundResult> {
    if (!params.receiptNumber) {
      throw new RailRejectedError(
        'MISSING_RECEIPT_NUMBER',
        'TNM refund requires receipt_number from the settled invoice',
        this.railId,
      );
    }
    const token = await this.getToken();
    try {
      const { data } = await this.http.post<{
        data: { reversal_transaction_id: string };
      }>(
        `/invoices/refund/${params.receiptNumber}`,
        {},
        { headers: this.authHeader(token) },
      );
      return {
        externalRef: data.data.reversal_transaction_id,
        status: 'ACCEPTED',
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  /**
   * Polls TNM for invoice status.
   * Maps paid/reversed state to RailDepositStatusResult.
   * On success includes receipt_number for storage.
   */
  async getDepositStatus(invoiceNumber: string): Promise<RailDepositStatusResult> {
    const token = await this.getToken();
    try {
      const { data } = await this.http.get<{
        data: {
          invoice_number: string;
          paid: boolean;
          reversed: boolean;
          receipt_number: string | null;
          settled_at: string | null;
        };
      }>(`/invoices/${invoiceNumber}`, { headers: this.authHeader(token) });

      const { paid, reversed, receipt_number } = data.data;

      if (paid && !reversed) {
        return {
          status: 'COMPLETED',
          receiptNumber: receipt_number ?? undefined,
        };
      }
      if (paid && reversed) return { status: 'FAILED' };
      return { status: 'PENDING' };
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw new RailRejectedError('NOT_FOUND', 'Invoice not found', this.railId);
      }
      throw this.mapError(err);
    }
  }

  /**
   * TNM refunds are synchronous — once accepted, the refund is complete.
   */
  async getRefundStatus(_externalRef: string): Promise<RailRefundStatus> {
    return 'COMPLETED';
  }

  /**
   * Validates MSISDN against TNM subscriber database.
   * Returns 'TNM' if subscriber exists, null otherwise.
   */
  async predictProvider(phoneNumber: string): Promise<string | null> {
    const token = await this.getToken();
    const msisdn = this.normaliseMsisdn(phoneNumber);
    try {
      const { data } = await this.http.get<{
        data: { customer_exists: boolean };
      }>(`/invoices/validate/${msisdn}`, { headers: this.authHeader(token) });
      return data.data.customer_exists ? 'TNM' : null;
    } catch {
      return null;
    }
  }

  /**
   * Checks TNM availability by attempting authentication.
   */
  async checkAvailability(_country: string): Promise<RailAvailability> {
    try {
      await this.getToken();
      return { available: true };
    } catch {
      return { available: false, reason: 'TNM authentication failed' };
    }
  }

  // ─── Error mapping ────────────────────────────────────────────────────────

  private mapError(err: unknown): Error {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message: string = (err.response?.data as { message?: string })?.message ?? '';

      if (status === 401) {
        this.logger.error('[RAIL_AUTH_ERROR] TNM 401 — invalid credentials');
        return new RailAuthError('TNM invalid credentials', this.railId);
      }
      if (status === 403) {
        this.logger.error(`[RAIL_AUTH_ERROR] TNM 403 — ${message}`);
        return new RailAuthError(`TNM forbidden: ${message}`, this.railId);
      }
      if (status === 404) {
        if (message.toLowerCase().includes('subscriber')) {
          return new RailRejectedError('SUBSCRIBER_NOT_FOUND', message, this.railId);
        }
        return new RailRejectedError('NOT_FOUND', message, this.railId);
      }
      if (status === 400) {
        if (message.toLowerCase().includes('valid tnm number')) {
          return new RailRejectedError('INVALID_PHONE', message, this.railId);
        }
        return new RailRejectedError('INVALID_INPUT', message, this.railId);
      }
      if (status === 503) {
        return new RailUnavailableError(message || 'TNM service unavailable', this.railId);
      }
      if (status && status >= 500) {
        return new RailUnavailableError(`TNM ${status}`, this.railId);
      }
      if (err.code === 'ECONNABORTED') {
        return new RailTimeoutError('TNM request timed out', this.railId);
      }
    }
    return new RailUnavailableError(
      `TNM unknown error: ${(err as Error).message}`,
      this.railId,
    );
  }
}
