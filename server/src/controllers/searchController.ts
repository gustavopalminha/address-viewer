import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/searchService';

export const searchAddresses = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.params.query;

    // Enforce standard: API should require at least 3 chars [cite: 10]
    if (!query || query.length < 3) {
       res.status(400).json({ 
         error: 'Query must be at least 3 characters long' 
       });
       return;
    }

    const results = searchService.search(query);
    res.json(results); //[cite: 12]
  } catch (error) {
    next(error);
  }
};