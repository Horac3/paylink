import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @description Extracts MerchantId from JWT payload in request context.
 * @example
 * async getProfile(@CurrentMerchant() merchantId: string) { ... }
 */
export const CurrentMerchant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: { sub: string } }>();
    return request.user.sub;
  },
);
