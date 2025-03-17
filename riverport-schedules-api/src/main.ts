import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Apply global pipes and filters
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    // Format validation errors according to our ErrorResponseDto format
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        const constraints = Object.values(error.constraints || {});
        return constraints.length > 0 ? constraints[0] : 'Validation error';
      });
      
      const message = messages.length > 0 
        ? `Validation failed: ${messages[0]}`
        : 'Validation failed';
        
      return new BadRequestException(message);
    }
  }));
  
  // Apply our error response interceptor globally
  app.useGlobalInterceptors(new ErrorResponseInterceptor());
  
  // Apply our exception filters globally (order matters - more specific first)
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter()
  );

  const config = new DocumentBuilder()
    .setTitle('Schedule and Routes Management API')
    .setDescription('API для управління маршрутами та розкладами річкового транспорту')
    .setVersion('1.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap', err);
  process.exit(1);
}); 