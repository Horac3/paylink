import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from '@shared/filters/domain-exception.filter';
import { LoggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: config.get<string>('WEB_URL'),
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters + interceptors + guards
  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PayLink API')
    .setDescription('Payment orchestration API for the Malawian market')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local')
    .addServer('https://api.paylink.never9to5ive.com', 'Production')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = config.get<number>('APP_PORT', 3000);
  await app.listen(port);
  console.log(`PayLink API running on port ${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}

bootstrap().catch(console.error);
