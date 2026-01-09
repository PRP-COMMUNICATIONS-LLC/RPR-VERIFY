import { test, expect } from '@playwright/test';

test.describe('Sovereign Governance Audit: Evidence Filtering', () => {

  test('TC-GOV-01: Client-First Review - BANK_MODE must hide behavioral_score', async ({ page }) => {
    // 1. Mock the API response to include the sensitive data field
    await page.route('**/rpr-verify-backend-*.run.app', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'SUCCESS',
          case_id: 'GOV-AUDIT-001',
          risk_status: 'GREEN',
          forensic_metadata: {
            // ... metadata fields
          },
          data: {
            identity: { fullName: 'John Doe' },
            behavioral_score: '0.98' // Sensitive data that should be filtered
          }
        }),
      });
    });

    // 2. Navigate to the verification page with the BANK_MODE query parameter
    await page.goto('/verification?viewMode=BANK');

    // 3. Assert that the sensitive data is NOT visible in the DOM
    const sensitiveDataLocator = page.locator('text=/behavioral_score/i');
    await expect(sensitiveDataLocator).not.toBeVisible();

    // 4. As a control, verify that non-sensitive data IS visible
    const nonSensitiveDataLocator = page.locator('text="John Doe"');
    await expect(nonSensitiveDataLocator).toBeVisible();
  });

});
