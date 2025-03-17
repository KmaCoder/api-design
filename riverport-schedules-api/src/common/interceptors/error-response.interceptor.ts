import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * Interceptor that transforms all errors thrown from controllers and services
 * into the ErrorResponseDto format.
 */
@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        // Log the error for debugging
        this.logger.error(
          `Error caught in interceptor: ${error.message}`,
          error.stack
        );

        if (error instanceof HttpException) {
          // Pass HttpExceptions through to be handled by the filter
          return throwError(() => error);
        } else {
          // Transform other errors to Internal Server Error with our format
          const errorResponse: ErrorResponseDto = {
            message: 'Internal Server Error - unexpected error occurred'
          };
          return throwError(() => new HttpException(
            errorResponse,
            HttpStatus.INTERNAL_SERVER_ERROR
          ));
        }
      }),
    );
  }
} 