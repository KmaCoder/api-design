import { Injectable, Logger } from '@nestjs/common';
import { BoatDto } from '../../mock-boats/dto/boat.dto';
import { BoatsApiService } from './boats-api.service';

@Injectable()
export class BoatsService {
  private readonly logger = new Logger(BoatsService.name);

  constructor(private readonly boatsApiService: BoatsApiService) {}

  async getAllBoats(): Promise<BoatDto[]> {
    this.logger.log('Service: Getting all boats');
    return this.boatsApiService.getBoats();
  }

  async getBoatById(id: string): Promise<BoatDto> {
    this.logger.log(`Service: Getting boat with ID: ${id}`);
    return this.boatsApiService.getBoatById(id);
  }

  async updateBoat(id: string, updateData: Partial<BoatDto>): Promise<BoatDto> {
    this.logger.log(`Service: Updating boat with ID: ${id}`);
    return this.boatsApiService.updateBoat(id, updateData);
  }
} 
