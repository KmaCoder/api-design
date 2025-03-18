import { Injectable, Logger } from '@nestjs/common';
import { BoatDto } from '../mock-boats/dto/boat.dto';
import axios from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class BoatsApiService {
  private readonly apiClient;
  private readonly baseUrl = 'http://localhost:3000/third-party/boats';

  constructor() {
    this.apiClient = axios.create({
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axiosRetry(this.apiClient, {
      retries: 3,
      retryDelay: (retryCount) => {
        return Math.pow(2, retryCount - 1) * 300;
      },
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response && error.response.status >= 500)
        );
      },
    });
  }

  async getBoats(): Promise<BoatDto[]> {
    const response = await this.apiClient.get(this.baseUrl);
    return response.data;
  }

  async getBoatById(id: string): Promise<BoatDto> {
    const response = await this.apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateBoat(id: string, updateData: Partial<BoatDto>): Promise<BoatDto> {
    const response = await this.apiClient.put(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }
} 