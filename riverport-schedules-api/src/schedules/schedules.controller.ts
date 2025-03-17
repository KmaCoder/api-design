import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { SchedulesService } from './schedules.service';
import {
  CreateScheduleDto,
  ScheduleDto,
  UpdateScheduleDto,
  UpdateScheduleStatusDto,
} from './dto/schedule.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Schedules')
@Controller('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN) // Default access for all endpoints
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримання списку розкладів' })
  @ApiResponse({ status: 200, description: 'Успішне отримання списку розкладів', type: ScheduleDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal Server Error - несподівана помилка', type: ErrorResponseDto })
  async findAll(
    @Query('date') date?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.schedulesService.findAll(date, page, limit);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Створення нового розкладу' })
  @ApiResponse({ status: 201, description: 'Розклад успішно створено', type: ScheduleDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректні дані запиту', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal Server Error - несподівана помилка', type: ErrorResponseDto })
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get(':scheduleId')
  @ApiOperation({ summary: 'Отримання детальної інформації про розклад' })
  @ApiResponse({ status: 200, description: 'Успішне отримання інформації про розклад', type: ScheduleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - розклад не знайдено', type: ErrorResponseDto })
  async findOne(@Param('scheduleId') scheduleId: string) {
    return this.schedulesService.findOne(scheduleId);
  }

  @Put(':scheduleId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Повне оновлення розкладу' })
  @ApiResponse({ status: 200, description: 'Розклад успішно оновлено', type: ScheduleDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректні дані запиту', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - розклад не знайдено', type: ErrorResponseDto })
  async update(
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(scheduleId, updateScheduleDto);
  }

  @Delete(':scheduleId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Видалення розкладу' })
  @ApiResponse({ status: 204, description: 'Розклад успішно видалено' })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - розклад не знайдено', type: ErrorResponseDto })
  async remove(@Param('scheduleId') scheduleId: string) {
    await this.schedulesService.remove(scheduleId);
  }

  @Patch(':scheduleId/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Часткове оновлення статусу розкладу' })
  @ApiResponse({ status: 200, description: 'Статус розкладу успішно оновлено', type: ScheduleDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректні дані запиту', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - розклад не знайдено', type: ErrorResponseDto })
  async updateStatus(
    @Param('scheduleId') scheduleId: string,
    @Body() updateStatusDto: UpdateScheduleStatusDto,
  ) {
    return this.schedulesService.updateStatus(scheduleId, updateStatusDto);
  }
} 