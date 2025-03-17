import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * Fallback exception filter that catches all unhandled exceptions
 * and formats them according to the ErrorResponseDto format.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // If it's an HttpException, get its status, otherwise use 500
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Format the error response according to our DTO
    const errorResponse: ErrorResponseDto = {
      message: this.getErrorMessage(exception, status)
    };

    // Log detailed error information
    this.logger.error(
      `Exception handled: ${errorResponse.message}`
    );

    // Send the formatted response
    response
      .status(status)
      .json(errorResponse);
  }

  /**
   * Extract appropriate error message based on exception type
   */
  private getErrorMessage(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      
      if (typeof response === 'object' && response.message) {
        return Array.isArray(response.message)
          ? response.message[0]
          : response.message;
      }
      
      return exception.message;
    }
    
    if (exception instanceof Error) {
      // Don't expose error details in production
      return process.env.NODE_ENV === 'production'
        ? this.getDefaultMessageForStatus(status)
        : exception.message;
    }
    
    return this.getDefaultMessageForStatus(status);
  }

  /**
   * Get default message for HTTP status code
   */
  private getDefaultMessageForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized - missing or invalid token';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden - insufficient privileges';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error - unexpected error occurred';
      default:
        return `Error: status code ${status}`;
    }
  }
} 