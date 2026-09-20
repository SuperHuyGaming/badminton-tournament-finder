import { test, expect } from '@playwright/test';

test.describe('Optimistic UI RSVP Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should optimistically update RSVP button to "Signed Up" immediately upon click', async ({ page }) => {
    // Find the first RSVP button
    const rsvpButton = page.getByRole('button', { name: /RSVP/i }).first();
    await expect(rsvpButton).toBeVisible();

    const initialText = await rsvpButton.textContent();

    // Click RSVP button
    await rsvpButton.click();

    // Verify instant optimistic state change to "Signed Up"
    const signedUpButton = page.getByRole('button', { name: /Signed Up/i }).first();
    await expect(signedUpButton).toBeVisible();

    // Verify button has success color styling
    await expect(signedUpButton).toHaveClass(/MuiButton-containedSuccess/);
  });
});
