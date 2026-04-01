import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * @description Structured request/response logging interceptor.
 * Masks MSISDN to last 4 digits in logs.
 * Applied globally in main.ts.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(`${method} ${this.maskMsisdn(url)} ${ms}ms`);
      }),
    );
  }

  private maskMsisdn(input: string): string {
    // Mask phone numbers — keep only last 4 digits
    return input.replace(/(\+?265\d*)(\d{4})/g, '****$2');
  }
}
