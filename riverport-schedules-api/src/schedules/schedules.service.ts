import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RoutesService } from '../routes/routes.service';
import { Schedule } from './entities/schedule.entity';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  UpdateScheduleStatusDto,
  ScheduleStatus,
} from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    private readonly routesService: RoutesService,
  ) {}

  async findAll(date?: string, page = 1, limit = 10) {
    const queryBuilder = this.schedulesRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.route', 'route')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('schedule.departureTime', 'ASC');

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      queryBuilder.andWhere('schedule.departureTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const [schedules, total] = await queryBuilder.getManyAndCount();

    return {
      schedules,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: ['route'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // Verify that the route exists
    await this.routesService.findOne(createScheduleDto.routeId);

    const schedule = this.schedulesRepository.create(createScheduleDto);
    return await this.schedulesRepository.save(schedule);
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    // Verify that the route exists if routeId is being updated
    if (updateScheduleDto.routeId) {
      await this.routesService.findOne(updateScheduleDto.routeId);
    }

    Object.assign(schedule, updateScheduleDto);
    return await this.schedulesRepository.save(schedule);
  }

  async updateStatus(id: string, updateStatusDto: UpdateScheduleStatusDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    
    // Validate status transition
    if (!this.isValidStatusTransition(schedule.status, updateStatusDto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    schedule.status = updateStatusDto.status;
    return await this.schedulesRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const result = await this.schedulesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Schedule not found');
    }
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