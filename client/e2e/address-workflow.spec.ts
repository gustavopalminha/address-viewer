import { test, expect } from '@playwright/test';
import { MOCK_ADDRESSES } from '../src/context/address/__tests__/fixtures/addresses'; // Assuming addresses.ts is one level up from e2e

// Define constants for the test
const API_URL_PATTERN = '**/api/search/*'; 
const DEBOUNCE_DELAY_MS = 1000; // Assuming a reasonable debounce time for the UI to wait before calling the API

test.describe('Address Search Workflow', () => {

  // Run this setup before each test in this suite
  test.beforeEach(async ({ page }) => {
    // 1. Set up API MOCKING for all tests in this suite
    await page.route(API_URL_PATTERN, async route => {
      // Intercept the request and respond with a successful JSON payload
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ADDRESSES),
      });
    });
    
    // Navigate to the app URL
    await page.goto('/');
  });
  
// --- Test Case 1: Success State (Input >= 3 Chars) ---
  test('should call API, show loading, and display mocked list items', async ({ page }) => {
    const INPUT_TEXT = 'Oslo'; // 4 characters (>= 3)
    
    // Locate the input field by its name attribute (or use page.getByRole('textbox', { name: 'address' }))
    const addressInput = page.getByRole('textbox', { name: 'address' });
    const addressList = page.getByTestId('address-list');

    // 1. ACT: Type the text into the input field
    await addressInput.fill(INPUT_TEXT);
    
    // 2. WAIT: Pause to allow the assumed debounce timer to complete
    await page.waitForTimeout(DEBOUNCE_DELAY_MS);

    // 3. ASSERT SUCCESS: Verify the list container is visible
    await expect(addressList).toBeVisible();

    // 4. ASSERT COUNT: Verify the number of list items matches the mock data
    const listItems = addressList.locator('li');
    await expect(listItems).toHaveCount(MOCK_ADDRESSES.length);
    
    // 5. ASSERT CONTENT: Check if one of the mock addresses is present
    await expect(addressList).toContainText(MOCK_ADDRESSES[0].street);
  });
  
// --- Test Case 2: Disclaimer State (Input < 3 Chars) ---
  test('should show friendly disclaimer and NOT call the API when input has less than 3 characters', async ({ page }) => {
    const INPUT_TEXT = 'Os'; // 2 characters (< 3)
    
    // Create a Promise to check if the API was ever called (should remain unresolved)
    let apiCalled = false;
    page.on('request', request => {
        if (request.url().includes('/api/search/')) {
            apiCalled = true;
        }
    });
    
    // Locate the input field and the disclaimer element
    const addressInput = page.getByRole('textbox', { name: 'address' });
    const disclaimer = page.getByTestId('friendly-disclaimer');
    const addressList = page.getByTestId('address-list'); // Ensure this is not visible

    // 1. ACT: Type the text into the input field
    await addressInput.fill(INPUT_TEXT);
    
    // 2. WAIT: Pause for a safety margin to ensure no API call is triggered
    await page.waitForTimeout(DEBOUNCE_DELAY_MS + 200); 

    // 3. ASSERT DISCLAMER: Check that the disclaimer is visible
    await expect(disclaimer).toBeVisible();

    // 4. ASSERT LIST: Check that the list is NOT visible
    await expect(addressList).not.toBeVisible();
    
    // 5. ASSERT NO API CALL: Check that the request listener was never triggered
    expect(apiCalled).toBe(false);
  });
});