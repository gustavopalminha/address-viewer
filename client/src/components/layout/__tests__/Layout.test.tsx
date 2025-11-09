import { render, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';

// 1. Mock the imported child components
// This allows us to test the Layout's composition without relying on the
// potentially complex internals of Header, Body, and Footer.
vi.mock('../Header', () => ({
  // Mock Header to return an element identifiable by a test ID
  Header: vi.fn(() => <header data-testid="header-mock" />),
}));

vi.mock('../Body', () => ({
  // Mock Body to return an element identifiable by a test ID
  Body: vi.fn(() => <main data-testid="body-mock" />),
}));

vi.mock('../Footer', () => ({
  // Mock Footer to return an element identifiable by a test ID
  Footer: vi.fn(() => <footer data-testid="footer-mock" />),
}));

import { Layout } from '../Layout'; // Adjust the import path as necessary

// --- Test Suite for the Layout Component ---
describe('Layout', () => {
  test('should render Header, Body, and Footer components', () => {
    // 1. ARRANGE: Render the component
    render(<Layout />);

    // 2. ASSERT: Check for the presence of the mocked elements using their test IDs

    // Check for the Header component
    const headerElement = screen.getByTestId('header-mock');
    expect(headerElement).toBeInTheDocument();

    // Check for the Body component
    const bodyElement = screen.getByTestId('body-mock');
    expect(bodyElement).toBeInTheDocument();
    
    // Check for the Footer component
    const footerElement = screen.getByTestId('footer-mock');
    expect(footerElement).toBeInTheDocument();
  });
});