import { Controller, Get, Param, Put, Body, HttpException, HttpStatus, Logger, Patch, UseGuards } from '@nestjs/common';
import { BoatDto } from '../../mock-boats/dto/boat.dto';
import { BoatsService } from './boats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';

@ApiTags('BoatsIntegration')
@Controller('/integrations/boats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
export class BoatsController {
  private readonly logger = new Logger(BoatsController.name);

  constructor(private readonly boatsService: BoatsService) {}

  @Get()
  async getAllBoats(): Promise<BoatDto[]> {
    try {
      const boats = await this.boatsService.getAllBoats();
      return boats;
    } catch (error) {
      this.logger.error(`Error getting all boats: ${error.message}`);
      throw new HttpException(
        'Failed to retrieve boats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getBoatById(@Param('id') id: string): Promise<BoatDto> {
    try {
      this.logger.log(`Request to get boat with ID: ${id}`);
      const boat = await this.boatsService.getBoatById(id);
      
      if (!boat) {
        throw new HttpException(`Boat with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      
      return boat;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error getting boat with ID ${id}: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve boat with ID ${id}`,
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
      const updatedBoat = await this.boatsService.updateBoat(id, updateData);
      
      if (!updatedBoat) {
        throw new HttpException(`Boat with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      
      return updatedBoat;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error updating boat with ID ${id}: ${error.message}`);
      throw new HttpException(
        `Failed to update boat with ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
