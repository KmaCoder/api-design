import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto, RouteDto, UpdateRouteDto } from './dto/route.dto';

let routes: RouteDto[] = [
  {
    id: '1',
    name: 'Mock Route',
    startLocation: 'Mock Location 1',
    endLocation: 'Mock Location 2',
    distance: 100,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Mock Route 2',
    startLocation: 'Mock Location 3',
    endLocation: 'Mock Location 4',
    distance: 200,
    createdAt: '2021-01-02T00:00:00.000Z',
    updatedAt: '2021-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Mock Route 3',
    startLocation: 'Mock Location 5',
    endLocation: 'Mock Location 6',
    distance: 300,
    createdAt: '2021-01-03T00:00:00.000Z',
    updatedAt: '2021-01-03T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Mock Route 4',
    startLocation: 'Mock Location 7',
    endLocation: 'Mock Location 8',
    distance: 400,
    createdAt: '2021-01-04T00:00:00.000Z',
    updatedAt: '2021-01-04T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Mock Route 5',
    startLocation: 'Mock Location 9',
    endLocation: 'Mock Location 10',
    distance: 500,
    createdAt: '2021-01-05T00:00:00.000Z',
    updatedAt: '2021-01-05T00:00:00.000Z',
  },
];

@Injectable()
export class RoutesService {
  constructor(
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<RouteDto>   {
    const lastRoute = routes[routes.length - 1];
    const newId = lastRoute ? (Number(lastRoute.id) + 1).toString() : '1';

    const newRoute = {
      id: newId,
      name: createRouteDto.name,
      startLocation: createRouteDto.startLocation,
      endLocation: createRouteDto.endLocation,
      distance: createRouteDto.distance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    routes.push(newRoute);

    return newRoute;
  }

  async findAll(): Promise<RouteDto[]> {
    return routes;
  }

  async findOne(id: string): Promise<RouteDto> {
    const route = routes.find(route => route.id === id);
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<RouteDto> {
    const route = routes.find(route => route.id === id);

    if (!route) {
      throw new NotFoundException('Route not found');
    } 

    route.name = updateRouteDto.name;
    route.startLocation = updateRouteDto.startLocation;
    route.endLocation = updateRouteDto.endLocation;
    route.distance = updateRouteDto.distance;
    route.updatedAt = new Date().toISOString();
    
    return route;
  }

  async remove(id: string): Promise<void> {
    const index = routes.findIndex(route => route.id === id);
    if (index === -1) {
      throw new NotFoundException('Route not found');
    }
    routes.splice(index, 1);
  }
} 