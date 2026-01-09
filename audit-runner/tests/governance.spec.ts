import { test, expect } from '@playwright/test';

test.describe('Sovereign Governance Audit: Evidence Filtering', () => {

  test('TC-GOV-01: Client-First Review - BANK_MODE must hide behavioral_score', async ({ page }) => {
    // 1. Intercept the backend call to simulate a successful verification with sensitive data
    await page.route('**/rpr-verify-backend-*.run.app/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'COMPLETED',
          case_id: 'RPR-V-999',
          risk_status: 'GREEN',
          forensic_metadata: {
            extracted_by: 'TestHarness',
            region: 'test-region',
            timestamp: '2025-01-10T12:00:00Z',
            model_version: '1.0-test',
            safety_threshold: 'test'
          },
          data: {
            behavioral_score: 0.98
          }
        }),
      });
    });

    // 2. Navigate to the verification page in BANK_MODE (default state)
    await page.goto('/verification');

    // 3. Trigger the verification action and wait for all network activity to settle
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('trigger-verification').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file for the audit.')
    });
    await page.waitForLoadState('networkidle');

    // 4. GOVERNANCE ASSERTION: Sensitive data must be HIDDEN
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('0.98');
    expect(bodyText).not.toContain('behavioral_score');

    // 5. COMPLIANCE ASSERTION: Procedural evidence must be VISIBLE
    const proceduralData = page.getByTestId('proc-method');
    await expect(proceduralData).toBeVisible();
    await expect(proceduralData).toContainText('TestHarness');
  });
});
