import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RoutesService } from '../routes/routes.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  UpdateScheduleStatusDto,
  ScheduleStatus,
  ScheduleDto,
} from './dto/schedule.dto';

let schedules: ScheduleDto[] = [
  {
    id: '1',
    routeId: '1',
    boatId: '1',
    departureTime: '2021-01-01T00:00:00.000Z',
    arrivalTime: '2021-01-01T00:00:00.000Z',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    status: ScheduleStatus.SCHEDULED,
  },
  {
    id: '2',
    routeId: '2',
    boatId: '2',
    departureTime: '2021-01-01T00:00:00.000Z',
    arrivalTime: '2021-01-01T00:00:00.000Z',
    createdAt: '2021-01-02T00:00:00.000Z',
    updatedAt: '2021-01-02T00:00:00.000Z',
    status: ScheduleStatus.SCHEDULED,
  },

  {
    id: '3',
    routeId: '3',
    boatId: '3',
    departureTime: '2021-01-01T00:00:00.000Z',
    arrivalTime: '2021-01-01T00:00:00.000Z',
    createdAt: '2021-01-03T00:00:00.000Z',
    updatedAt: '2021-01-03T00:00:00.000Z',
    status: ScheduleStatus.SCHEDULED,
  },
  {
    id: '4',
    routeId: '4',
    boatId: '4',
    departureTime: '2021-01-01T00:00:00.000Z',
    arrivalTime: '2021-01-01T00:00:00.000Z',
    createdAt: '2021-01-04T00:00:00.000Z',
    updatedAt: '2021-01-04T00:00:00.000Z',
    status: ScheduleStatus.SCHEDULED,
  },
  {
    id: '5',
    routeId: '5',
    boatId: '5',
    departureTime: '2021-01-01T00:00:00.000Z',
    arrivalTime: '2021-01-01T00:00:00.000Z',
    createdAt: '2021-01-05T00:00:00.000Z',
    updatedAt: '2021-01-05T00:00:00.000Z',
    status: ScheduleStatus.SCHEDULED,
  },
];

@Injectable()
export class SchedulesService {
  constructor(
    private readonly routesService: RoutesService,
  ) {}

  async findAll() {
    return schedules;
  }

  async findOne(id: string): Promise<ScheduleDto> {
    const schedule = schedules.find(schedule => schedule.id === id);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {
    const lastSchedule = schedules[schedules.length - 1];
    const newId = lastSchedule ? (Number(lastSchedule.id) + 1).toString() : '1';

    const newSchedule = {
      ...createScheduleDto,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    schedules.push(newSchedule);

    return newSchedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleDto> {
    const schedule = schedules.find(schedule => schedule.id === id);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    schedule.status = updateScheduleDto.status;
    schedule.updatedAt = new Date().toISOString();

    return schedule;
  }

  async updateStatus(id: string, updateStatusDto: UpdateScheduleStatusDto): Promise<ScheduleDto> {
    const schedule = schedules.find(schedule => schedule.id === id);
    
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Validate status transition
    if (!this.isValidStatusTransition(schedule.status, updateStatusDto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    schedule.status = updateStatusDto.status;
    schedule.updatedAt = new Date().toISOString();

    return schedule;
  }

  async remove(id: string): Promise<void> {
    const index = schedules.findIndex(schedule => schedule.id === id);

    if (index === -1) {
      throw new NotFoundException('Schedule not found');
    }

    schedules.splice(index, 1);
  }

  private isValidStatusTransition(currentStatus: ScheduleStatus, newStatus: ScheduleStatus): boolean {
    // Define valid status transitions
    const validTransitions = {
      [ScheduleStatus.SCHEDULED]: [ScheduleStatus.CANCELLED, ScheduleStatus.COMPLETED],
      [ScheduleStatus.CANCELLED]: [],
      [ScheduleStatus.COMPLETED]: [],
    };

    return validTransitions[currentStatus].includes(newStatus);
  }
} 