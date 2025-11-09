import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';

import { Loading } from '../'; // Adjust the import path as necessary

// --- Test Suite for the Loading Component ---
describe('Loading', () => {

  // Test 1: Check the default state (default label)
  test('should render with the default "Loading..." label', () => {
    // 1. ARRANGE: Render the component without any props
    render(<Loading />);

    // 2. ACT/ASSERT: Check for the presence of the default label text.
    const defaultLabel = screen.getByText('Loading...');

    expect(defaultLabel).toBeInTheDocument();
  });
  
  // Test 2: Check rendering with a custom label
  test('should render with a custom label when provided', () => {
    const customLabel = 'Fetching data...';
    
    // 1. ARRANGE: Render the component with a custom label prop
    render(<Loading label={customLabel} />);

    // 2. ACT/ASSERT: Check for the presence of the custom label text.
    const customLabelElement = screen.getByText(customLabel);

    expect(customLabelElement).toBeInTheDocument();
  });
  
  // Test 3: Check for the presence of the visual loading icon (Loader2)
  test('should render the loading spinner icon (Loader2)', () => {
    // 1. ARRANGE: Render the component. We destructure 'container' to access the raw DOM structure.
    const { container } = render(<Loading />);
    
    // 2. ACT/ASSERT: Use the container to query the DOM directly for the element 
    // that has the specific 'animate-spin' class, which is unique to the icon.
    
    // Query the element with the specific class applied by the Loader2 icon.
    // The querySelector will return the first matching element or null.
    const spinnerElement = container.querySelector('.animate-spin');
    
    // B. Assert that the element was found and is in the document
    expect(spinnerElement).toBeInTheDocument();

    // C. (Optional verification) Assert it's an SVG, which lucide-react uses.
    expect(spinnerElement?.tagName).toBe('svg');
  });
  
  // Test 4: Check if custom class names are applied to the wrapper div
  test('should apply custom class names to the wrapper div', () => {
    const customClass = 'bg-red-100 p-10';
    
    // 1. ARRANGE: Render the component with a custom class
    render(<Loading className={customClass} />);

    // 2. ACT/ASSERT: The wrapper is the outermost div. We can find it by its default text.
    const wrapper = screen.getByText('Loading...').closest('div');
    
    // Assert that the wrapper element exists and contains the custom class
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass(customClass.split(' ').join(' '));
  });
});