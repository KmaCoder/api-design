import { Injectable, NestMiddleware, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

// Constants for delay configuration
const MIN_SHORT_DELAY_SECONDS = 0.5;
const MAX_SHORT_DELAY_SECONDS = 2;

const MIN_LONG_DELAY_SECONDS = 10;
const MAX_LONG_DELAY_SECONDS = 15;

const LONG_DELAY_PROBABILITY = 0.1; // chance of longer delay

// Error probability configuration
const ERROR_PROBABILITY = 0.5;

@Injectable()
export class RandomDelayErrorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RandomDelayErrorMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    // Determine if we should use a long delay
    const useLongDelay = Math.random() < LONG_DELAY_PROBABILITY;
    
    // Calculate delay based on selected range
    let delaySeconds;
    if (useLongDelay) {
      // Generate a long delay (10-30 seconds)
      delaySeconds = Math.floor(Math.random() * (MAX_LONG_DELAY_SECONDS - MIN_LONG_DELAY_SECONDS + 1)) + MIN_LONG_DELAY_SECONDS;
      this.logger.log(`Using long delay of ${delaySeconds}s for ${req.method} ${req.url}`);
    } else {
      // Generate a short delay (1-3 seconds)
      delaySeconds = Math.floor(Math.random() * (MAX_SHORT_DELAY_SECONDS - MIN_SHORT_DELAY_SECONDS + 1)) + MIN_SHORT_DELAY_SECONDS;
      this.logger.log(`Using short delay of ${delaySeconds}s for ${req.method} ${req.url}`);
    }
    
    const delayMs = delaySeconds * 1000;
    
    // Calculate if we should return an error based on ERROR_PROBABILITY
    const shouldError = Math.random() < ERROR_PROBABILITY;
    
    if (shouldError) {
      this.logger.warn(`Throwing random 500 error after ${delaySeconds}s delay for ${req.method} ${req.url}`);
      
      // Wait for the random delay
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // Throw an error instead of manually responding
      throw new InternalServerErrorException('Unexpected server error occurred');
    } else {
      this.logger.log(`Adding ${delaySeconds}s random delay to ${req.method} ${req.url}`);
      
      // Wait for the random delay and then continue
      await new Promise(resolve => setTimeout(resolve, delayMs));
      next();
    }
  }
} 