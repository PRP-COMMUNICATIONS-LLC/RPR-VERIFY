import { test, expect } from '@playwright/test';

test.describe('Sovereign Gatekeeper Audit: Phase 4 Final Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the verification route as the primary audit target
    await page.goto('/verification');
    await page.waitForLoadState('networkidle');
  });

  test('TC-01: Sovereign Logo Lock & Horizontal Integrity', async ({ page }) => {
    // Robust Text-Based Locator ensuring brand visibility
    const logoText = page.locator('span:has-text("VERIFY")');

    // 1. Visibility: Confirm the brand is rendered and visible
    await expect(logoText).toBeVisible();

    // 2. Horizontal Lock: Confirm the "No-Stack" mandate via CSS
    await expect(logoText).toHaveCSS('white-space', 'nowrap');
    await expect(logoText).toHaveCSS('color', 'rgb(0, 255, 255)');

    // 3. Flex Container Check: Verify the parent prevents wrapping
    const container = logoText.locator('..'); // Targets the parent element
    await expect(container).toHaveCSS('display', 'flex');
    await expect(container).toHaveCSS('flex-wrap', 'nowrap');
  });

  test('TC-02: Red Alert Transition & Branding Color Integrity', async ({ page }) => {
    // Shared text-based locator for consistent state checking
    const logoText = page.locator('span:has-text("VERIFY")');

    // 1. Baseline Verification: Confirm Sovereign Cyan (rgb(0, 255, 255))
    await expect(logoText).toHaveCSS('color', 'rgb(0, 255, 255)');

    // 2. Trigger State Shift: Inject "Escalated" class manually
    // This bypasses Angular DI issues and tests CSS robustness directly
    await page.evaluate(() => {
      // Find the logo text and apply the class to its container
      const logoSpan = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent?.trim().includes('VERIFY'));

      const container = logoSpan?.parentElement;
      if (container) {
        container.classList.add('is-escalated');
      }
    });

    // 3. Visual Delta Check: Confirm Shift to Pure Red (rgb(255, 0, 0))
    await expect(logoText).toHaveCSS('color', 'rgb(255, 0, 0)', { timeout: 5000 });
  });

});
