import { test, expect } from '@playwright/test';

test.describe('Client', ()=>{
  test('should load the application and display the "Address Viewer" title and Address UI', async ({ page }) => {
    // 1. Navigate to the client application URL
    await page.goto('/');

    // 2. Locate the element containing the content bellow.
    const titleLocator = page.getByText('Address Viewer');
    const addressLocator = page.getByTestId('address-ui');

    // 3. Assert that the element is visible on the page.
    await expect(titleLocator).toBeVisible();
    await expect(addressLocator).toBeVisible();
  });
})