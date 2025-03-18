import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoutesModule } from './routes/routes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { BoatsModule } from './integrations/boats/boats.module';
import { MockBoatsModule } from './mock-boats/mock-boats.module';
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
    MockBoatsModule,
    BoatsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RandomDelayErrorMiddleware)
      .exclude('health', 'third-party/boats', 'integrations/boats')
      .forRoutes('*');
  }
} 
