import { Address } from '../types/address';
// DO NOT import 'fs', 'path', 'TrieSearch' here. They are mocked inside the tests.

// --- Mock Data ---
const mockAddresses: Address[] = [
  { street: 'Test Street 1', city: 'OSLO', postNumber: '1' } as Address,
  { street: 'Test Avenue 2', city: 'BERGEN', postNumber: '2' } as Address,
  { street: 'Test Avenue 3', city: 'OZINK', postNumber: '3' } as Address,
];
const mockJsonString = JSON.stringify(mockAddresses);
const mockDataPath = 'mock/path/to/data/adresses.json';

// --- Mock Implementations ---
// We define these in the outer scope so we can clear them
const mockAddAll = jest.fn();
const mockGet = jest.fn();

// --- Mocks ---
// We mock fs and path so Jest knows about them.
// We'll configure them *inside* the tests.
jest.mock('fs');
jest.mock('path');

// --- Spy on process.exit and console ---
const mockProcessExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);
const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});
const mockConsoleWarn = jest
  .spyOn(console, 'warn')
  .mockImplementation(() => {});

// --- The Test Suite ---
describe('SearchService', () => {
  // --- Block 1: Success Tests ---
  describe('on successful data load', () => {
    let searchService: any;
    let fsMock: { readFileSync: jest.Mock };
    let pathMock: { join: jest.Mock };

    beforeAll(async () => {
      jest.clearAllMocks();
      jest.resetModules(); // Resets all modules

      // We must re-mock TrieSearch *after* resetting modules.
      // We use jest.doMock() because it is not hoisted.
      jest.doMock('trie-search', () => ({
        __esModule: true, // Signal it's an ES Module
        default: jest.fn().mockImplementation(() => { // Mock the default export
          // This is the mock constructor
          return {
            // This is the mock instance
            addAll: mockAddAll,
            get: mockGet,
          };
        }),
      }));

      // Get fresh mock for fs
      fsMock = require('fs') as { readFileSync: jest.Mock };
      fsMock.readFileSync.mockReturnValue(mockJsonString);

      // Get fresh mock for path
      pathMock = require('path') as { join: jest.Mock };
      pathMock.join.mockReturnValue(mockDataPath);

      // Set up the trie.get return value
      mockGet.mockReturnValue(mockAddresses);

      // NOW we import the service.
      searchService = (await import('./searchService')).searchService;
    });

    it('should return search results directly from the trie', () => {
      // Act
      const results = searchService.search('Test');
      // Assert
      expect(mockGet).toHaveBeenCalledWith('Test');
      expect(results).toEqual(mockAddresses);
    });

    it('should limit search results to 20', () => {
      // Arrange
      const longList = new Array(25)
        .fill(0)
        .map((_, i) => ({ street: `Street ${i}` } as Address));
      mockGet.mockReturnValue(longList);

      // Act
      const results = searchService.search('Street');
      // Assert
      expect(mockGet).toHaveBeenCalledWith('Street');
      expect(results.length).toBe(20);
      expect(results[19].street).toBe('Street 19');
    });
  });

  // --- Block 2: Failure Test ---
  describe('on data loading failure', () => {
    it('should handle data loading failure', async () => {
      // Arrange
      jest.clearAllMocks();
      jest.resetModules();

      const loadError = new Error('File not found');

      // We still need to mock path so it doesn't fail
      const pathMock = require('path') as { join: jest.Mock };
      pathMock.join.mockReturnValue(mockDataPath);

      // Import the fresh mock *after* reset
      const fsMock = require('fs') as { readFileSync: jest.Mock };
      // Set up the *failing* file read
      fsMock.readFileSync.mockImplementation(() => {
        throw loadError;
      });
      
      // We don't need to mock TrieSearch, as the constructor
      // will fail in loadData() before it's called.

      // Act: Import the service. The constructor will fail.
      const failedService = (await import('./searchService')).searchService;

      // Assert (Loading)
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to load address dataset:',
        loadError,
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);

      // Assert (Searching)
      const results = failedService.search('test');
      expect(results).toEqual([]);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Search service queried before data was loaded.',
      );
    });
  });
});