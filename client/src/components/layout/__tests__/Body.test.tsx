import { render, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';

// 1. Mock the child components and the context provider
// When we render the Body component, we don't want to run the actual
// code of these children (which might have their own side effects or
// external dependencies). We only want to ensure they are rendered.
vi.mock('@/components/address', () => ({
  // We mock AddressForm to return a simple identifiable component
  Address: vi.fn(() => <div data-testid="address-mock" />),
}));

vi.mock('@/context/address/provider', () => ({
  // We mock the Provider to return its children, allowing us to
  // test that Body wraps everything correctly.
  AddressContextProvider: vi.fn(({ children }) => (
    <div data-testid="context-provider-mock">{children}</div>
  )),
}));

import { Body } from '../Body'; // Adjust the import path as necessary

// --- Test Suite for the Body Component ---
describe('Body', () => {
  test('should render AddressContextProvider and Address', () => {
    // 1. ARRANGE: Render the component
    render(<Body />);

    // 2. ASSERT: Check for the presence of the mocked elements

    // Check if the AddressContextProvider wrapper is present
    const contextProvider = screen.getByTestId('context-provider-mock');
    expect(contextProvider).toBeInTheDocument();

    // Check if Address is rendered inside the Body
    const address = screen.getByTestId('address-mock');
    expect(address).toBeInTheDocument();
    
    // (Optional but good practice) Check the structure:
    // Assert that the Form and List are children of the Provider
    expect(contextProvider).toContainElement(address);
  });
});