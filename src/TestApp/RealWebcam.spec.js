const { test, expect, chromium } = require('@playwright/test');

// This test uses real webcam and opens visible browser windows.
// One person creates meeting on localhost:3000, another joins from localhost:3001
test('Two people join meeting - one creates, one joins from different port', async () => {
  // Launch two separate browser instances for better isolation
  const browserA = await chromium.launch({ headless: false });
  const browserB = await chromium.launch({ headless: false });

  // Context A - Person who creates the meeting (localhost:3000)
  const contextA = await browserA.newContext({
    permissions: ['camera', 'microphone'],
    baseURL: 'http://localhost:3000',
  });
  const pageA = await contextA.newPage();

  // Context B - Person who joins the meeting (localhost:3001)
  const contextB = await browserB.newContext({
    permissions: ['camera', 'microphone'],
    baseURL: 'http://localhost:3001',
  });
  const pageB = await contextB.newPage();

  try {
    // Person A creates meeting on localhost:3000
    await pageA.goto('http://localhost:3000');
    await pageA.getByRole('button', { name: 'Create Meeting' }).click();
    await expect(pageA.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    
    // Get the meeting ID
    const meetingIdText = await pageA.getByRole('heading', { name: /Meeting Id:/ }).textContent();
    const meetingId = meetingIdText.split('Meeting Id: ')[1].trim();
    console.log('Meeting ID created:', meetingId);

    // Person A joins their own meeting
    await pageA.getByRole('button', { name: 'Join' }).click();
    await expect(pageA.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // Ensure Person A's webcam is ON
    if (await pageA.getByText(/Webcam: OFF/).isVisible().catch(() => false)) {
      await pageA.getByRole('button', { name: 'toggleWebcam' }).click();
    }

    // Person B goes to localhost:3001 and joins the same meeting
    await pageB.goto('http://localhost:3001');
    
    // Fill in the meeting ID that Person A created
    await pageB.locator('input[type="text"]').fill(meetingId);
    await pageB.getByRole('button', { name: 'Join' }).click();
    
    // Verify Person B sees the meeting ID
    await expect(pageB.getByRole('heading', { name: new RegExp(`Meeting Id: ${meetingId}`) })).toBeVisible();
    
    // Person B joins the meeting
    await pageB.getByRole('button', { name: 'Join' }).click();
    await expect(pageB.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // Ensure Person B's webcam is ON
    if (await pageB.getByText(/Webcam: OFF/).isVisible().catch(() => false)) {
      await pageB.getByRole('button', { name: 'toggleWebcam' }).click();
    }

    // Verify both users have video elements with real webcam feeds
    const videoA = pageA.locator('video').first();
    const videoB = pageB.locator('video').first();

    await expect(videoA).toBeVisible({ timeout: 30000 });
    await expect(videoB).toBeVisible({ timeout: 30000 });

    // Check that videos are actually playing (readyState >= 2 means video has enough data)
    await expect.poll(async () => await videoA.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
    await expect.poll(async () => await videoB.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);

    // Verify both participants can see each other in the participant list
    await expect(pageA.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/).first()).toBeVisible();
    await expect(pageB.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/).first()).toBeVisible();

    // Keep windows open for visual verification
    console.log('Both users joined successfully. Keeping windows open for 5 seconds...');
    await pageA.waitForTimeout(5000);

  } finally {
    // Clean up - close both browsers
    await browserA.close();
    await browserB.close();
  }
});

// Alternative version: Using single browser with two contexts (more lightweight)
test('Two people join meeting - single browser, two contexts', async () => {
  const browser = await chromium.launch({ headless: false });

  // Context A - Person who creates the meeting (localhost:3000)
  const contextA = await browser.newContext({
    permissions: ['camera', 'microphone'],
    baseURL: 'http://localhost:3000',
  });
  const pageA = await contextA.newPage();

  // Context B - Person who joins the meeting (localhost:3001)  
  const contextB = await browser.newContext({
    permissions: ['camera', 'microphone'],
    baseURL: 'http://localhost:3001',
  });
  const pageB = await contextB.newPage();

  try {
    // Person A creates meeting on localhost:3000
    await pageA.goto('http://localhost:3000');
    await pageA.getByRole('button', { name: 'Create Meeting' }).click();
    await expect(pageA.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
    
    // Get the meeting ID
    const meetingIdText = await pageA.getByRole('heading', { name: /Meeting Id:/ }).textContent();
    const meetingId = meetingIdText.split('Meeting Id: ')[1].trim();
    console.log('Meeting ID created:', meetingId);

    // Person A joins their own meeting
    await pageA.getByRole('button', { name: 'Join' }).click();
    await expect(pageA.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // Person B goes to localhost:3001 and joins the same meeting
    await pageB.goto('http://localhost:3001');
    await pageB.locator('input[type="text"]').fill(meetingId);
    await pageB.getByRole('button', { name: 'Join' }).click();
    await expect(pageB.getByRole('heading', { name: new RegExp(`Meeting Id: ${meetingId}`) })).toBeVisible();
    await pageB.getByRole('button', { name: 'Join' }).click();
    await expect(pageB.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

    // Ensure both webcams are ON
    if (await pageA.getByText(/Webcam: OFF/).isVisible().catch(() => false)) {
      await pageA.getByRole('button', { name: 'toggleWebcam' }).click();
    }
    if (await pageB.getByText(/Webcam: OFF/).isVisible().catch(() => false)) {
      await pageB.getByRole('button', { name: 'toggleWebcam' }).click();
    }

    // Verify video elements for both users
    const videoA = pageA.locator('video').first();
    const videoB = pageB.locator('video').first();

    await expect(videoA).toBeVisible({ timeout: 30000 });
    await expect(videoB).toBeVisible({ timeout: 30000 });

    await expect.poll(async () => await videoA.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
    await expect.poll(async () => await videoB.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);

    // Verify participant lists show both users
    await expect(pageA.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/)).toHaveCount(2);
    await expect(pageB.getByText(/Participant: .* \| Webcam: (ON|OFF) \| Mic: (ON|OFF)/)).toHaveCount(2);

    // Keep windows open for visual verification
    console.log('Both users joined successfully. Keeping windows open for 5 seconds...');
    await pageA.waitForTimeout(5000);

  } finally {
    // Clean up
    await contextA.close();
    await contextB.close();
    await browser.close();
  }
});

// Simplified version - just the essential parts
test('Simple two-user meeting test', async () => {
  const browser = await chromium.launch({ headless: false });
  
  const contextA = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });
  const contextB = await browser.newContext({
    permissions: ['camera', 'microphone'],
  });
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  // Person A creates meeting on localhost:3000
  await pageA.goto('http://localhost:3000');
  await pageA.getByRole('button', { name: 'Create Meeting' }).click();
  await expect(pageA.getByRole('heading', { name: /Meeting Id:/ })).toBeVisible();
  
  const meetingIdText = await pageA.getByRole('heading', { name: /Meeting Id:/ }).textContent();
  const meetingId = meetingIdText.split('Meeting Id: ')[1].trim();

  await pageA.getByRole('button', { name: 'Join' }).click();
  await expect(pageA.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

  // Person B joins from localhost:3001
  await pageB.goto('http://localhost:3001');
  await pageB.locator('input[type="text"]').fill(meetingId);
  await pageB.getByRole('button', { name: 'Join' }).click();
  await expect(pageB.getByRole('heading', { name: new RegExp(`Meeting Id: ${meetingId}`) })).toBeVisible();
  await pageB.getByRole('button', { name: 'Join' }).click();
  await expect(pageB.getByRole('button', { name: 'Leave' })).toBeVisible({ timeout: 30000 });

  // Verify both have video feeds
  await expect(pageA.locator('video').first()).toBeVisible({ timeout: 30000 });
  await expect(pageB.locator('video').first()).toBeVisible({ timeout: 30000 });

  // Wait to see both windows
  await pageA.waitForTimeout(3000);

  await browser.close();
});