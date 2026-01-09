import { test, expect } from '@playwright/test';

test.describe('Sovereign Branding Audit: Tab 3', () => {

  test('TC-01: Hero Title has correct default branding (H1, White)', async ({ page }) => {
    await page.goto('/verification');

    const heroTitle = page.locator('h1:has-text("VERIFICATION")');

    // 1. Verify semantic tag for SEO
    await expect(heroTitle).toBeVisible();

    // 2. Verify default color is White for "Sentinel Blackout"
    await expect(heroTitle).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('TC-02: Hero Title transitions to Red Alert on error', async ({ page }) => {
    // 1. Intercept backend calls and force 500 Forensic Failure
    await page.route('**/rpr-verify-backend-*.run.app/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'ForensicIntegrityFailure',
          message: 'Document integrity compromised. Red Alert triggered.',
          code: 500,
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

    // 4. Wait for the component's state to update before checking the color
    await page.waitForFunction(() => {
      const el = document.querySelector('h1');
      if (!el || !el.textContent?.includes('VERIFICATION')) return false;
      return window.getComputedStyle(el).color === 'rgb(255, 0, 0)';
    });

    // 5. Verify the color transitions to Red
    await expect(heroTitle).toHaveCSS('color', 'rgb(255, 0, 0)');
  });

});
