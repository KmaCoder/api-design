import { Module } from '@nestjs/common';
import { BoatsController } from './boats.controller';
import { BoatsService } from './boats.service';
import { BoatsApiService } from './boats-api.service';
import { MockBoatsModule } from '../../mock-boats/mock-boats.module';

@Module({
  imports: [MockBoatsModule],
  controllers: [BoatsController],
  providers: [BoatsService, BoatsApiService],
  exports: [BoatsService],
})
export class BoatsModule {} 
