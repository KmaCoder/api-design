import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { BoatDto } from './dto/boat.dto';

@Injectable()
export class BoatsApiMockService {
  private boats: BoatDto[] = [
    { id: '1', name: 'River Queen' },
    { id: '2', name: 'Ocean Explorer' },
    { id: '3', name: 'Harbor Master' },
    { id: '4', name: 'Bay Cruiser' },
    { id: '5', name: 'Lake Navigator' },
  ];

  private readonly MIN_DELAY_MS = 200;
  private readonly MAX_DELAY_MS = 1500;
  
  private ERROR_PROBABILITY = 0.5;

  private async simulateNetworkConditions(): Promise<void> {
    const delayMs = Math.floor(Math.random() * (this.MAX_DELAY_MS - this.MIN_DELAY_MS + 1)) + this.MIN_DELAY_MS;
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    if (Math.random() < this.ERROR_PROBABILITY) {
      throw new InternalServerErrorException('Unexpected error from Boats API');
    }
  }

  async getBoats(): Promise<BoatDto[]> {
    await this.simulateNetworkConditions();
    return [...this.boats];
  }

  async getBoatById(id: string): Promise<BoatDto> {
    await this.simulateNetworkConditions();
    
    const boat = this.boats.find(b => b.id === id);
    if (!boat) {
      return null;
    }
    
    return { ...boat };
  }

  async updateBoat(id: string, updateData: Partial<BoatDto>): Promise<BoatDto> {
    await this.simulateNetworkConditions();
    
    const boatIndex = this.boats.findIndex(b => b.id === id);
    if (boatIndex === -1) {
      return null;
    }
    
    this.boats[boatIndex] = {
      ...this.boats[boatIndex],
      ...updateData,
    };
    
    return { ...this.boats[boatIndex] };
  }
} 