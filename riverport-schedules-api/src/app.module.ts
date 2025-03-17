import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoutesModule } from './routes/routes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RandomDelayErrorMiddleware } from './common/middleware/random-delay-error.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoutesModule,
    SchedulesModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RandomDelayErrorMiddleware)
      .exclude('health') // Exclude health check endpoint
      .forRoutes('*'); // Apply to all other routes
  }
} 