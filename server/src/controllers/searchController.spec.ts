import { Request, Response, NextFunction } from 'express';
import { searchAddresses } from './searchController';
import { searchService } from '../services/searchService';
import { Address } from '../types/address'; // Import your type

// 1. Mock the searchService
// We tell Jest to replace the searchService with a mock object
jest.mock('../services/searchService', () => ({
  searchService: {
    search: jest.fn(),
  },
}));

// --- Test Suite ---
describe('Search Controller (searchController.ts)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  // Before each test, reset the mock objects
  beforeEach(() => {
    jest.clearAllMocks(); // Clears call history for all mocks

    // Create a mock request object
    mockRequest = {
      params: {},
    };

    // Create a mock response object
    // We mock .status() to return 'this' (the mockResponse)
    // so that we can chain .json() just like in Express.
    mockResponse = {
      status: jest.fn(() => mockResponse as Response),
      json: jest.fn(),
    };

    // Create a mock next function
    mockNext = jest.fn();
  });

  // --- Test 1: Successful Search ---
  it('should return search results for a valid query', () => {
    // Arrange
    const query = 'Oslo';
    const searchResults: Address[] = [
      { street: 'Oslo Street 1', city: 'OSLO' } as Address,
    ];
    
    // Set up the request parameters
    mockRequest.params = { query };

    // Tell our mock service what to return
    (searchService.search as jest.Mock).mockReturnValue(searchResults);

    // Act
    searchAddresses(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    // Was the service called with the correct query?
    expect(searchService.search).toHaveBeenCalledWith(query);
    // Did we send the results as JSON?
    expect(mockResponse.json).toHaveBeenCalledWith(searchResults);
    // Was status() NOT called? (implying 200 OK)
    expect(mockResponse.status).not.toHaveBeenCalled();
    // Was the error handler NOT called?
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Test 2: Query Too Short ---
  it('should return a 400 error if the query is less than 3 characters', () => {
    // Arrange
    const query = 'Os';
    mockRequest.params = { query };

    // Act
    searchAddresses(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    // Was the service NOT called?
    expect(searchService.search).not.toHaveBeenCalled();
    // Was the status set to 400?
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    // Was the error message sent as JSON?
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Query must be at least 3 characters long',
    });
    // Was the error handler NOT called?
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Test 3: Service Throws an Error ---
  it('should call the error handler (next) if the service fails', () => {
    // Arrange
    const query = 'ValidQuery';
    const serviceError = new Error('Database connection failed');
    mockRequest.params = { query };

    // Tell our mock service to throw an error
    (searchService.search as jest.Mock).mockImplementation(() => {
      throw serviceError;
    });

    // Act
    searchAddresses(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    // Was the service still called?
    expect(searchService.search).toHaveBeenCalledWith(query);
    // Was a JSON response NOT sent?
    expect(mockResponse.json).not.toHaveBeenCalled();
    // Was the error handler (next) called with the correct error?
    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});