const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('Setting up dual app instances...');
  
  // Check if both ports are available
  const browser = await chromium.launch();
  
  try {
    // Test port 3000
    const page1 = await browser.newPage();
    await page1.goto('http://localhost:3000', { timeout: 5000 });
    console.log('✅ App running on localhost:3000');
    await page1.close();
  } catch (error) {
    console.log('❌ App not running on localhost:3000. Please start with: npm start');
    throw new Error('App must be running on localhost:3000');
  }

  try {
    // Test port 3001
    const page2 = await browser.newPage();
    await page2.goto('http://localhost:3001', { timeout: 5000 });
    console.log('✅ App running on localhost:3001');
    await page2.close();
  } catch (error) {
    console.log('❌ App not running on localhost:3001. Please start second instance with: PORT=3001 npm start');
    throw new Error('App must be running on localhost:3001');
  }

  await browser.close();
  console.log('✅ Both app instances are ready for testing');
}

module.exports = globalSetup;
