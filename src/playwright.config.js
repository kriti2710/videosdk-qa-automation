// playwright.config.js
module.exports = {
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000', // Default for single participant tests
    headless: true,
    browserName: 'chromium',
    permissions: ['microphone', 'camera'],
    launchOptions: {
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        '--no-sandbox',
        '--autoplay-policy=no-user-gesture-required',
      ],
    },
    screenshot: 'on',
    video: 'on-first-retry',
    trace: 'retain-on-failure',
  },
  // Global setup for multi-participant tests
  globalSetup: require.resolve('./TestApp/global-setup.js'),
};
