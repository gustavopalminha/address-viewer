import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest'; 

import { Header } from '../Header'; // Ensure this path is correct

// --- Test Suite for the Header Component ---
describe('Header', () => {
  
  // Test 1: Check for the specific required text
  test('should contain the "Address Viewer"', () => {
    // ARRANGE: Render the component
    render(<Header />);
    
    // ACT/ASSERT: Check if the current year text is present in the document
    const addressText = screen.getByText('Address Viewer');

    // ASSERT: Verify the address text element is in the DOM
    expect(addressText).toBeInTheDocument();
  });
});