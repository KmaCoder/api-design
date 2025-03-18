import { Controller, Get, Param, Put, Body, HttpException, HttpStatus, Logger, Patch } from '@nestjs/common';
import { BoatDto } from './dto/boat.dto';
import { BoatsApiMockService } from './boats-api.mock.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BoatsMock')
@Controller('third-party/boats')
export class MockBoatsController {
  private readonly logger = new Logger(MockBoatsController.name);

  constructor(private readonly boatsApiMockService: BoatsApiMockService) {}

  @Get()
  async getAllBoats(): Promise<BoatDto[]> {
    try {
      const boats = await this.boatsApiMockService.getBoats();
      return boats;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve boats from mock API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getBoatById(@Param('id') id: string): Promise<BoatDto> {
    try {
      const boat = await this.boatsApiMockService.getBoatById(id);
      
      if (!boat) {
        throw new HttpException(`Boat with ID ${id} not found in mock API`, HttpStatus.NOT_FOUND);
      }
      
      return boat;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Failed to retrieve boat with ID ${id} from mock API`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateBoat(
    @Param('id') id: string,
    @Body() updateData: Partial<BoatDto>,
  ): Promise<BoatDto> {
    try {
      const updatedBoat = await this.boatsApiMockService.updateBoat(id, updateData);
      
      if (!updatedBoat) {
        throw new HttpException(`Boat with ID ${id} not found in mock API`, HttpStatus.NOT_FOUND);
      }
      
      return updatedBoat;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Mock API: Error updating boat with ID ${id}: ${error.message}`);
      throw new HttpException(
        `Failed to update boat with ID ${id} in mock API`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 