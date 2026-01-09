import { test, expect } from '@playwright/test';

test.describe('Sovereign Branding Audit: Tab 3', () => {

  test('TC-01: Hero Title has correct default branding (H1, Cyan)', async ({ page }) => {
    await page.goto('/verification');

    const heroTitle = page.locator('h1:has-text("VERIFICATION")');
    const heroIcon = page.locator('svg[fill="#00FFFF"]');

    // 1. Verify semantic tag for SEO
    await expect(heroTitle).toBeVisible();

    // 2. Verify default color is Cyan
    await expect(heroTitle).toHaveCSS('color', 'rgb(0, 255, 255)');
    await expect(heroIcon).toBeVisible();
  });

  test('TC-02: Hero Title transitions to Red Alert on error', async ({ page }) => {
    // 1. Mock a failed API response (ValidationError)
    await page.route('**/rpr-verify-backend-*.run.app', async route => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ERROR',
          errorCode: 'ValidationError',
          message: 'Simulated data mismatch for audit.'
        }),
      });
    });

    // 2. Navigate and trigger the API call that will fail
    await page.goto('/verification');
    // In a real app, we would click the button that triggers the API call.
    // Since the component in this test environment may call it on init,
    // we just need to wait for the state change.

    const heroTitle = page.locator('h1:has-text("VERIFICATION")');

    // 3. Verify the color transitions to Red
    await expect(heroTitle).toHaveCSS('color', 'rgb(255, 0, 0)', { timeout: 5000 });
  });

});
