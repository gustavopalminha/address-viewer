import { renderHook } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import { useAddressSearch } from '../hooks';
import { AddressContext } from '../context';
import type { AddressContextValue } from '../types';
import { MOCK_ADDRESSES } from './fixtures/addresses';

// Mock Provider for testing the happy path
const mockContextValue: AddressContextValue = {
  addresses: MOCK_ADDRESSES,
  fetchAddress: vi.fn(),
  isLoading: false,
};

describe('useAddressSearch', () => {
  
  // Test 1: Happy Path - Ensure the hook returns the context value when inside the provider
  test('should return the context value when rendered inside AddressContext.Provider', () => {
    // ARRANGE: Create a wrapper component that provides the context
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AddressContext.Provider value={mockContextValue}>
        {children}
      </AddressContext.Provider>
    );

    // ACT: Render the hook using the wrapper
    const { result } = renderHook(() => useAddressSearch(), { wrapper });

    // ASSERT: Check that the returned value matches the mocked context value
    expect(result.current).toEqual(mockContextValue);
    expect(result.current.addresses.length).toBe(3);
    expect(result.current.fetchAddress).toBeTypeOf('function');
  });

  // Test 2: Error Path - Ensure the hook throws an error when used outside the provider
  test('should throw an error when used outside AddressContextProvider', () => {
    // ACT/ASSERT: Render the hook without a wrapper and expect it to throw
    
    // We expect the call to useAddressSearch to throw the error
    expect(() => {
      // Vitest's renderHook should be wrapped in expect() to catch the error
      renderHook(() => useAddressSearch()); 
    }).toThrow('useAddressSearch must be used within a AddressContextProvider');
  });
});