import { Module } from '@nestjs/common';
import { BoatsApiMockService } from './boats-api.mock.service';
import { MockBoatsController } from './mock-boats.controller';

@Module({
  controllers: [MockBoatsController],
  providers: [BoatsApiMockService],
  exports: [BoatsApiMockService],
})
export class MockBoatsModule {} 