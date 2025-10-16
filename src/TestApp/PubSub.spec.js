const { test } = require('@playwright/test');

// Skipped until chat UI / PubSub wiring is added to the app
test.skip('PubSub chat: A sends message, B receives with correct payload', async () => {
  // TODO: Implement when chat UI exists. Expected steps:
  // - Create meeting with A, join B with same meetingId
  // - A: send chat message via chat UI
  // - B: assert message appears with correct text and sender metadata
});




