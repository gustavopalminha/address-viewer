import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest'; 

import { Footer } from '../Footer'; // Ensure this path is correct

// --- Test Suite for the Footer Component ---
describe('Footer', () => {
  
  // Test 1: Check for the specific required text
  test('should contain the text "Made with"', () => {
    // ARRANGE: Render the component
    render(<Footer />);

    // ACT/ASSERT: Use screen.getByText to find the required text.
    // The { exact: false } option allows matching "Made with" even if it's
    // part of a larger text node (e.g., "2025 - Made with").
    const madeWithText = screen.getByText('Made with', { exact: false });
    
    // ASSERT: Verify the element is in the DOM
    expect(madeWithText).toBeInTheDocument();
  });

  // Test 2: (Good practice) Check for the dynamic year
  test('should display the current year', () => {
    // ARRANGE: Render the component
    render(<Footer />);
    
    // Get the current year as a string to match the DOM content
    const currentYear = new Date().getFullYear().toString();

    // ACT/ASSERT: Check if the current year text is present in the document
    const yearText = screen.getByText(currentYear);

    // ASSERT: Verify the year element is in the DOM
    expect(yearText).toBeInTheDocument();
  });
});