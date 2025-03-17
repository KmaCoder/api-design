import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({ example: 'Маршрут A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Порт 1' })
  @IsString()
  startLocation: string;

  @ApiProperty({ example: 'Порт 2' })
  @IsString()
  endLocation: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  distance: number;
}

export class RouteDto extends CreateRouteDto {
  @ApiProperty({ example: 'abc123' })
  @IsString()
  id: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;
}

export class UpdateRouteDto extends CreateRouteDto {} 