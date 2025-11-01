import type { Request, Response, NextFunction, RequestHandler } from 'express';

// Wrapper to catch async errors in controllers
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
