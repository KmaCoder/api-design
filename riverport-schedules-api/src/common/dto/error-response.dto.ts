import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard error response DTO used across the application
 * for returning error messages to the client.
 */
export class ErrorResponseDto {
  /**
   * Error message describing what went wrong
   * @example "Bad Request - invalid input parameters"
   */
  @ApiProperty({
    description: 'Error message describing what went wrong',
    example: 'Bad Request - invalid input parameters',
  })
  message: string;
} 