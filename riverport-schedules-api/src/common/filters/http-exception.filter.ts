import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * Global exception filter that catches all HTTP exceptions and formats them
 * according to the ErrorResponseDto format.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    this.logger.error(`HTTP Exception: ${exception.message}`, exception.stack);
    
    // Get the exception response
    const exceptionResponse = exception.getResponse() as any;
    
    // Format the error response according to our DTO
    const errorResponse: ErrorResponseDto = {
      message: 
        // Use the custom message if it exists
        typeof exceptionResponse === 'object' && exceptionResponse.message
          ? Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0] // Use the first message if it's an array
            : exceptionResponse.message
          : exception.message || this.getDefaultMessageForStatus(status)
    };

    // Send the formatted response with the original status code
    response
      .status(status)
      .json(errorResponse);
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
        return 'Internal Server Error';
      default:
        return `Error: status code ${status}`;
    }
  }
} 