import { Request, Response, NextFunction } from 'express';
import { getSearchService } from '../server'; 
import { AppError } from '../middleware/errorHandler';

export const searchAddresses = (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchService = getSearchService();
    const query = req.params.query;

    // Enforce standard: API should require at least 3 chars
    if (!query || query.length < 3) {
       const validationError = new Error('Query must be at least 3 characters long') as AppError;
       validationError.status = 400;
       return next(validationError);
    }

    const results = searchService.search(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};