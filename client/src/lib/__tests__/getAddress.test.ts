import { test, expect, describe, vi, beforeEach, type Mock } from 'vitest';
import { getAddress } from '../getAddress'; // Adjust the import path as necessary
import { MOCK_ADDRESSES } from '@/context/address/__tests__/fixtures/addresses';

// 1. Mock the global fetch function
const fetchMock = vi.fn();
// Define the global fetch function to use our mock
vi.stubGlobal('fetch', fetchMock);

// Cast our fetch mock for easier type handling
const mockedFetch = fetchMock as Mock;

// Define a simple mock type for the return value
interface MockAddress {
  id: number;
  street: string;
}

describe('getAddress', () => {

  // Clear the mock history and reset the implementation before each test
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  // --- Test Case 1: Successful API Call (Happy Path) ---
  test('should fetch data successfully and return the parsed JSON', async () => {
    const MOCK_INPUT = '12345';

    // ARRANGE: Set up the mock response for a successful fetch (status 200)
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => MOCK_ADDRESSES, // Mock the .json() method to return our data
    });

    // ACT: Call the function
    const result = await getAddress<MockAddress[]>(MOCK_INPUT);

    // ASSERT 1: Check if fetch was called with the correct URL
    expect(mockedFetch).toHaveBeenCalledWith(`/api/search/${MOCK_INPUT}`);
    
    // ASSERT 2: Check if the function returned the expected mock data
    expect(result).toEqual(MOCK_ADDRESSES);
  });

  // --- Test Case 2: Unsuccessful API Call (Error Path) ---
  test('should throw an error if the response is not OK', async () => {
    const MOCK_STATUS_TEXT = 'Not Found';
    const MOCK_INPUT = 'invalid';

    // ARRANGE: Set up the mock response for a failed fetch (e.g., status 404)
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: MOCK_STATUS_TEXT, // Provide the statusText that the function throws
    });

    // ACT/ASSERT: Expect the function call to reject (throw an error)
    await expect(getAddress(MOCK_INPUT)).rejects.toThrow(MOCK_STATUS_TEXT);
    
    // Check that fetch was still called correctly
    expect(mockedFetch).toHaveBeenCalledWith(`/api/search/${MOCK_INPUT}`);
  });
});