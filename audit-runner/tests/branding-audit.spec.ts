import { test, expect } from '@playwright/test';

test.describe('Sovereign Branding Audit: Tab 3', () => {

  test('TC-01: Hero Title has correct default branding (H1, Cyan)', async ({ page }) => {
    await page.goto('/verification');

    const heroTitle = page.locator('h1:has-text("VERIFICATION")');

    // 1. Verify semantic tag for SEO
    await expect(heroTitle).toBeVisible();

    // 2. Verify default color is Cyan
    await expect(heroTitle).toHaveCSS('color', 'rgb(0, 255, 255)');
  });

  test('TC-02: Hero Title transitions to Red Alert on error', async ({ page }) => {
    // 1. Mock a failed API response (ValidationError)
    await page.route('**/rpr-verify-backend-*.run.app', async route => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'ValidationError',
            message: 'Simulated data mismatch for audit.'
          }
        }),
      });
    });

    // 2. Navigate and trigger the API call that will fail
    await page.goto('/verification');

    // 3. Simulate file upload to trigger the API call
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Process Document' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file.')
    });

    const heroTitle = page.locator('h1:has-text("VERIFICATION")');

    // 4. Verify the color transitions to Red
    await expect(heroTitle).toHaveCSS('color', 'rgb(255, 0, 0)', { timeout: 5000 });
  });

});
