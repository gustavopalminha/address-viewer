import { Request, Response, NextFunction } from 'express';

// Extend the standard Error type to include an optional status code
interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 1. Log the error for server-side debugging
  // In a real production app, you might use a logger like 'winston' here.
  console.error(`[Error] ${req.method} ${req.path}:`, err);

  // 2. Determine status code (default to 500 for unhandled crashes)
  const statusCode = err.status || 500;

  // 3. Construct the response
  const response = {
    error: {
      message: err.message || 'Internal Server Error',
      // Only include stack trace if NOT in production
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  };

  // 4. Send JSON response
  res.status(statusCode).json(response);
};