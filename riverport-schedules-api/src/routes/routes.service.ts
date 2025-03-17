import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto, RouteDto, UpdateRouteDto } from './dto/route.dto';
import { Route } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [routes, total] = await this.routesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      routes,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routesRepository.create(createRouteDto);
    return await this.routesRepository.save(route);
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    
    Object.assign(route, updateRouteDto);
    return await this.routesRepository.save(route);
  }

  async remove(id: string): Promise<void> {
    const result = await this.routesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Route not found');
    }
  }
} 