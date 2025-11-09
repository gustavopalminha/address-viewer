import { render, screen, act } from '@testing-library/react';
// FIX 1: Import 'Mock' as a type
import { test, expect, describe, vi, type Mock, beforeEach } from 'vitest';
import { AddressContext } from '../context';
import { AddressContextProvider } from '../provider';

// FIX 2: Hoisting fix - Mock the module first, defining the mock function inside the factory
vi.mock('@/lib/getAddress', () => ({
  // Define getAddress as a mock function directly inside the factory
  getAddress: vi.fn(),
}));

// Now, import the mocked function from the module
import { getAddress } from '@/lib/getAddress';
import { MOCK_ADDRESSES } from './fixtures/addresses';

// Cast the imported function to the Mock type for easy setup and assertion
const mockedGetAddress = getAddress as Mock;


// A helper component to consume the context for testing
const TestConsumer = () => {
  return (
    <AddressContext.Consumer>
      {(value) => {
        if(!value) return null;
        return (
          <>
            <span data-testid="addresses">{value.addresses.length}</span>
            <span data-testid="is-loading">{value.isLoading.toString()}</span>
            <button onClick={() => value.fetchAddress('123 Main St')}>Fetch</button>
          </>
        )
      }}
    </AddressContext.Consumer>
  );
};

describe('AddressContextProvider', () => {
  // Clear mock history before each test to prevent test pollution
  beforeEach(() => {
    mockedGetAddress.mockClear();
  });

  test('should provide initial context values', () => {
    // ARRANGE
    render(
      <AddressContextProvider>
        <TestConsumer />
      </AddressContextProvider>
    );

    // ASSERT initial state
    expect(screen.getByTestId('addresses')).toHaveTextContent('0');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  test('should update addresses and set isLoading to false after fetch', async () => {
    // ARRANGE: Set up the mock return value
    mockedGetAddress.mockResolvedValue(MOCK_ADDRESSES);
    
    render(
      <AddressContextProvider>
        <TestConsumer />
      </AddressContextProvider>
    );

    // ACT: Trigger the fetchAddress function
    const fetchButton = screen.getByText('Fetch');
    
    // Use act() to wrap state updates, especially those triggered asynchronously by useTransition
    await act(async () => {
      fetchButton.click();
    });

    // ASSERT: Check the final state
    expect(mockedGetAddress).toHaveBeenCalledWith('123 Main St');
    expect(screen.getByTestId('addresses')).toHaveTextContent(MOCK_ADDRESSES.length.toString());
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false'); // Should be false after transition finishes
  });
});