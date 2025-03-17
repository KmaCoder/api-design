import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesModule } from './routes/routes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { Route } from './routes/entities/route.entity';
import { Schedule } from './schedules/entities/schedule.entity';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Route, Schedule],
        migrations: [join(__dirname, 'database/migrations/*.{ts,js}')],
        migrationsRun: true,
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    RoutesModule,
    SchedulesModule,
    AuthModule,
  ],
})
export class AppModule {} 