import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { env } from '@/config/env';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Handle known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle PostgreSQL errors
  if (err.name === 'error' && 'code' in err) {
    const pgError = err as any;
    switch (pgError.code) {
      case '23505': // unique violation
        statusCode = 409;
        message = 'Resource already exists';
        isOperational = true;
        break;
      case '23503': // foreign key violation
        statusCode = 400;
        message = 'Referenced resource does not exist';
        isOperational = true;
        break;
      case '23502': // not null violation
        statusCode = 400;
        message = 'Required field is missing';
        isOperational = true;
        break;
      case '22P02': // invalid text representation
        statusCode = 400;
        message = 'Invalid data format';
        isOperational = true;
        break;
    }
  }

  // Log error
  if (!isOperational || statusCode >= 500) {
    logger.error(
      {
        err,
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
        params: req.params,
      },
      'Error occurred',
    );
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

// Handle 404 routes
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};
