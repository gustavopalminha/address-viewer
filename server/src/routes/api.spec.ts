// 1. Define the mock function we'll use for `router.get`
const mockGet = jest.fn();

// 2. Mock the 'express' module
jest.mock('express', () => ({
  Router: () => ({
    get: mockGet,
  }),
}));

// 3. Mock the controller
jest.mock('../controllers/searchController', () => ({
  searchAddresses: jest.fn(),
}));

// 4. Start the test suite
describe('API Routes (api.ts)', () => {
  // 5. Clear mocks before each test for clean isolation
  beforeEach(() => {
    mockGet.mockClear();
    // We also need to clear the mock for searchAddresses
    jest.clearAllMocks();
  });

  it('should mount the searchAddresses controller at the GET /search/:query route', () => {
    // 6. Import the mocked controller *inside* the test.
    // This ensures we get the fresh mock provided by step 3.
    const { searchAddresses } = require('../controllers/searchController');

    // 7. NOW we import the file-under-test.
    // This executes the code in api.ts, calling our mocks.
    require('./api');

    // 8. Run the assertions
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      '/search/:query',
      searchAddresses, // This is now the mocked function from step 6
    );
  });
});