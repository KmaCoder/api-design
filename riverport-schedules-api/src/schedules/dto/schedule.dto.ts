import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class CreateScheduleDto {
  @ApiProperty({ example: 'abc123' })
  @IsString()
  routeId: string;

  @ApiProperty({ example: 'boat777' })
  @IsString()
  @IsOptional()
  boatId?: string;

  @ApiProperty({ example: '2025-03-20T08:00:00Z' })
  @IsDateString()
  departureTime: string;

  @ApiProperty({ example: '2025-03-20T10:00:00Z' })
  @IsDateString()
  arrivalTime: string;

  @ApiProperty({ enum: ScheduleStatus, example: ScheduleStatus.SCHEDULED })
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}

export class ScheduleDto extends CreateScheduleDto {
  @ApiProperty({ example: 'sch001' })
  @IsString()
  id: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;
}

export class UpdateScheduleDto extends CreateScheduleDto {}

export class UpdateScheduleStatusDto {
  @ApiProperty({ enum: ScheduleStatus, example: ScheduleStatus.SCHEDULED })
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
} 