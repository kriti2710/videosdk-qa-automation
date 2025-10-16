const { test, expect } = require('@playwright/test');

test.describe('Meeting Setup - VideoSDK React App', () => {
  test('Test Case 1.1 - Create Meeting and Join Successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Create meeting
    const createButton = page.getByRole('button', { name: 'Create Meeting' });
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Verify meeting ID is displayed
    await expect(page.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    const meetingIdText = await page.getByRole('heading', { name: /Meeting Id:/ }).textContent();
    expect(meetingIdText).toMatch(/Meeting Id: [a-zA-Z0-9-]+/);

    // Join meeting
    const joinButton = page.getByRole('button', { name: 'Join' });
    await expect(joinButton).toBeVisible();
    await joinButton.click();

    // Verify joined state
    await expect(page.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: 'toggleMic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'toggleWebcam' })).toBeVisible();

    // Verify participant info is displayed
    await expect(page.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/)).toBeVisible();
  });

  test('Test Case 1.2 - Join Existing Meeting with Meeting ID', async ({ page }) => {
    // First create a meeting to get a valid meeting ID
    await page.goto('http://localhost:3001');
    await page.getByRole('button', { name: 'Create Meeting' }).click();
    await expect(page.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    
    const meetingIdText = await page.getByRole('heading', { name: /Meeting Id:/ }).textContent();
    const meetingId = meetingIdText.split('Meeting Id: ')[1].trim();

    // Navigate back to join screen
    await page.goto('http://localhost:3000');

    // Enter meeting ID and join
    const inputField = page.locator('input[type="text"]');
    await expect(inputField).toBeVisible();
    await inputField.fill(meetingId);

    const joinButton = page.getByRole('button', { name: 'Join' });
    await expect(joinButton).toBeVisible();
    await joinButton.click();

    // Verify we're in the meeting with the correct ID
    await expect(page.getByRole('heading', { name: new RegExp(`Meeting Id: ${meetingId}`) })).toBeVisible();
    
    // Join the meeting
    await page.getByRole('button', { name: 'Join' }).click();
    await expect(page.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });
  });

  test('Test Case 1.3 - Two Participants Join Same Meeting (Solution 1)', async ({ browser }) => {
    const contextA = await browser.newContext({ 
      permissions: ['microphone', 'camera'], 
      baseURL: 'http://localhost:3000' 
    });
    const contextB = await browser.newContext({ 
      permissions: ['microphone', 'camera'], 
      baseURL: 'http://localhost:3001' 
    });

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Participant A creates meeting
    await pageA.goto('http://localhost:3000');
    await pageA.getByRole('button', { name: 'Create Meeting' }).click();
    await expect(pageA.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    
    const meetingIdText = await pageA.getByRole('heading', { name: /Meeting Id:/ }).textContent();
    const meetingId = meetingIdText.split('Meeting Id: ')[1].trim();

    await pageA.getByRole('button', { name: 'Join' }).click();
    await expect(pageA.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // Participant B joins same meeting
    await pageB.goto('http://localhost:3001');
    await pageB.locator('input[type="text"]').fill(meetingId);
    await pageB.getByRole('button', { name: 'Join' }).click();
    await expect(pageB.getByRole('heading', { name: new RegExp(`Meeting Id: ${meetingId}`) })).toBeVisible();
    await pageB.getByRole('button', { name: 'Join' }).click();
    await expect(pageB.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // FIXED: Verify both participants are in the meeting using .first()
    await expect(pageA.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/).first()).toBeVisible();
    await expect(pageB.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/).first()).toBeVisible();

    await contextA.close();
    await contextB.close();
});
});
