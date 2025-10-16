const { test, expect } = require('@playwright/test');

test.describe('Device control - mic/webcam toggle', () => {
  test('toggle webcam and mic reflect in UI text', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Create Meeting' }).click();
    await expect(page.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    await page.getByRole('button', { name: 'Join' }).click();
    await expect(page.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    const webcamToggle = page.getByRole('button', { name: 'toggleWebcam' });
    const micToggle = page.getByRole('button', { name: 'toggleMic' });

    // Initial state text present
    const stateText = () => page.getByText(/Webcam: (ON|OFF) \| Mic: (ON|OFF)/);
    await expect(stateText()).toBeVisible();

    // Toggle webcam
    await webcamToggle.click();
    await expect(stateText()).toBeVisible();

    // Toggle mic
    await micToggle.click();
    await expect(stateText()).toBeVisible();

    // Toggle back
    await webcamToggle.click();
    await micToggle.click();
    await expect(stateText()).toBeVisible();
  });
});


