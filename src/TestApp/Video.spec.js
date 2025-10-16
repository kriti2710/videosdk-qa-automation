const { test, expect } = require('@playwright/test');

test.describe('Meeting flow - single participant', () => {
  test('creates meeting via API helper and joins successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const createOrJoin = page.getByRole('button', { name: 'Create Meeting' });
    await expect(createOrJoin).toBeVisible();

    await createOrJoin.click();

    // Expect Join button on MeetingView and meeting id text
    await expect(page.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    const joinBtn = page.getByRole('button', { name: 'Join' });
    await joinBtn.click();

    // Wait for joined state and controls
    await expect(page.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: 'toggleMic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'toggleWebcam' })).toBeVisible();

    // Assert local participant UI shows mic/webcam states text line
    await expect(page.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/)).toBeVisible();
  });
});
