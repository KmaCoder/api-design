import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { RoutesService } from './routes.service';
import { CreateRouteDto, RouteDto, UpdateRouteDto } from './dto/route.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Routes')
@Controller('routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримання списку маршрутів' })
  @ApiResponse({ status: 200, description: 'Успішне отримання списку маршрутів', type: RouteDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal Server Error - несподівана помилка', type: ErrorResponseDto })
  async findAll() {
    return this.routesService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Створення нового маршруту' })
  @ApiResponse({ status: 201, description: 'Маршрут успішно створено', type: RouteDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректні дані запиту', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal Server Error - несподівана помилка', type: ErrorResponseDto })
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get(':routeId')
  @ApiOperation({ summary: 'Отримання детальної інформації про маршрут' })
  @ApiResponse({ status: 200, description: 'Успішне отримання інформації про маршрут', type: RouteDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректний формат routeId', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - маршрут не знайдено', type: ErrorResponseDto })
  async findOne(@Param('routeId') routeId: string) {
    return this.routesService.findOne(routeId);
  }

  @Put(':routeId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Повне оновлення інформації про маршрут' })
  @ApiResponse({ status: 200, description: 'Маршрут успішно оновлено', type: RouteDto })
  @ApiResponse({ status: 400, description: 'Bad Request - некоректні дані запиту', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - маршрут не знайдено', type: ErrorResponseDto })
  async update(
    @Param('routeId') routeId: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    return this.routesService.update(routeId, updateRouteDto);
  }

  @Delete(':routeId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Видалення маршруту' })
  @ApiResponse({ status: 204, description: 'Маршрут успішно видалено' })
  @ApiResponse({ status: 401, description: 'Unauthorized - відсутній або недійсний токен', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - доступ заборонено (не ADMIN)', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found - маршрут не знайдено', type: ErrorResponseDto })
  async remove(@Param('routeId') routeId: string) {
    await this.routesService.remove(routeId);
  }
} 