import { test, expect } from '@playwright/test';

test.describe('Sovereign Gatekeeper Audit: Phase 4 Final Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the verification route as the primary audit target
    await page.goto('/verification');
  });

  test('TC-01: Sovereign Logo Visual Style Audit', async ({ page }) => {
    const logoContainer = page.locator('.logo-container');
    const rprWordmark = logoContainer.locator('span:has-text("RPR")');
    const verifyWordmark = logoContainer.locator('span:has-text("VERIFY")');

    // 1. Verify Horizontal Integrity (No Stacking)
    await expect(rprWordmark).toHaveCSS('white-space', 'nowrap');

    // 2. Verify Color Mandates
    await expect(rprWordmark).toHaveCSS('color', 'rgb(255, 255, 255)'); // White
    await expect(verifyWordmark).toHaveCSS('color', 'rgb(0, 255, 255)'); // Cyan
  });

  test('TC-02: Red Alert Transition & Branding Color Integrity', async ({ page }) => {
    const logoContainer = page.locator('.logo-container');
    const verifyWordmark = logoContainer.locator('span:has-text("VERIFY")');

    // 1. Baseline Verification: Confirm Sovereign Cyan
    await expect(verifyWordmark).toHaveCSS('color', 'rgb(0, 255, 255)');

    // 2. Trigger State Shift: Inject "Escalated" class manually
    await page.evaluate(() => {
      document.querySelector('.logo-container')?.classList.add('is-escalated');
    });

    // 3. Visual Delta Check: Confirm Shift to Pure Red
    await expect(verifyWordmark).toHaveCSS('color', 'rgb(255, 0, 0)', { timeout: 5000 });
  });

});
