import { Request, Response, NextFunction } from 'express';
import { searchAddresses } from './searchController';
import { SearchService } from '../services/searchService';
import { Address } from '../types/address';
// Removed: import { BadRequestError } from '../utils/ApiError'; 

// --- MOCK SETUP ---

// Mock data
const mockResults = [
    { 
      street: 'Mock Street', 
      city: 'Mock City', 
      postNumber: '12345',
      county: 'Mock County',
      district: 'Mock District',
      municipality: 'Mock Municipality',
      municipalityNumber: 'Mock MunicipalityNumber',
      type: 'Mock Type',
      typeCode: 'Mock TypeCode',
    },
] as Address[];

// Mock the SearchService methods used by the controller
const mockSearchService = {
    search: jest.fn((_query: string) => mockResults),
} as unknown as SearchService; // Type assertion since we are only mocking the 'search' method

// Mock the dependency injection hook (getSearchService from server.ts)
// We use jest.mock() to intercept the import of the server file.
jest.mock('../server', () => ({
    getSearchService: () => mockSearchService,
}));


// Mock Express utility functions
const mockReq = (params: any = {}): Partial<Request> => ({
    params: params,
});

const mockRes = (): Partial<Response> => ({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
});

const mockNext: NextFunction = jest.fn();


// --- TEST SUITE ---

describe('SearchController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        // Reset mocks before each test
        req = mockReq();
        res = mockRes();
        (mockNext as jest.Mock).mockClear();
        mockSearchService.search = jest.fn((_query: string) => mockResults);
    });

    it('should successfully return search results for a valid query', () => {
        const validQuery = 'LongEnoughQuery';
        req.params = { query: validQuery };

        searchAddresses(req as Request, res as Response, mockNext);

        // 1. Service should be called with the query parameter
        expect(mockSearchService.search).toHaveBeenCalledWith(validQuery);

        // 2. Response should return the results with status 200 (default)
        expect(res.json).toHaveBeenCalledWith(mockResults);

        // 3. next() should NOT be called
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() with an error object containing 400 status if query is too short (< 3 chars)', () => {
        // Test case: Query is "ab"
        req.params = { query: 'ab' };

        searchAddresses(req as Request, res as Response, mockNext);

        // 1. Service should NOT be called
        expect(mockSearchService.search).not.toHaveBeenCalled();

        // 2. next() should be called with an error object
        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Query must be at least 3 characters long',
                status: 400, // Check for the statusCode property instead of the class type
            })
        );
        // We can still check that it's an instance of Error, which should be true for ApiError subclasses
        expect((mockNext as jest.Mock).mock.calls[0][0]).toBeInstanceOf(Error);
        
        // 3. Response functions should NOT be called manually
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next() with an error object containing 400 status if query is missing (empty string)', () => {
        // Test case: Query is ""
        req.params = { query: '' };

        searchAddresses(req as Request, res as Response, mockNext);

        expect(mockSearchService.search).not.toHaveBeenCalled();
        // Check for the expected object shape, focusing on properties (message, statusCode)
        expect(mockNext).toHaveBeenCalledWith(
             expect.objectContaining({
                message: 'Query must be at least 3 characters long',
                status: 400,
            })
        );
    });
    
    // NEW TEST CASE: Explicitly test when the parameter is not present in req.params
    it('should call next() with an error object containing 400 status if query parameter is not set at all', () => {
        // Test case: req.params = {} (no 'query' key) or query is undefined
        req.params = {};

        searchAddresses(req as Request, res as Response, mockNext);

        expect(mockSearchService.search).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(
             expect.objectContaining({
                message: 'Query must be at least 3 characters long',
                status: 400,
            })
        );
    });

    it('should call next() for any unexpected error during search execution', () => {
        // Simulate a runtime error inside the service layer
        const unexpectedError = new Error('Database connection failed');
        mockSearchService.search = jest.fn(() => {
            throw unexpectedError;
        });

        req.params = { query: 'ValidQuery' };

        searchAddresses(req as Request, res as Response, mockNext);

        // 1. next() should be called with the unexpected error
        expect(mockNext).toHaveBeenCalledWith(unexpectedError);
        
        // 2. Response functions should NOT be called manually
        expect(res.json).not.toHaveBeenCalled();
    });
});