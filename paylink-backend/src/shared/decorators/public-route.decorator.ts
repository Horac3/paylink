import { SetMetadata } from '@nestjs/common';

/**
 * @description Marks a route as public — skips JwtAuthGuard.
 * @example
 * @PublicRoute()
 * @Get('/pay/:slug')
 * getPayPage() { ... }
 */
export const PublicRoute = () => SetMetadata('isPublic', true);
