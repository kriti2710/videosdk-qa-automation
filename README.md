# VideoSDK Playwright Tests

Automated Playwright end-to-end tests for the VideoSDK JS/React SDK covering meeting setup, media simulation, device control, and chat.

---

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Quick Start](#quick-start)  
- [Running Tests](#running-tests)  
  - [Run all tests](#run-all-tests)  
  - [Run a specific test suite](#run-a-specific-test-suite)  
  - [Run tests in headed (visible) mode](#run-tests-in-headed-visible-mode)  
  - [Using fake media devices](#using-fake-media-devices)  
- [Test Coverage](#test-coverage)  
- [Test Structure & Approach](#test-structure--approach)  
- [React App Scripts](#react-app-scripts)  
- [Troubleshooting](#troubleshooting)  
- [Learn More](#learn-more)  
- [Contributing](#contributing)  
- [License](#license)

---

## Prerequisites

Before running tests, ensure:

- Node.js (recommended LTS) is installed.
- Playwright is installed as a dev dependency (the commands below will prompt to install browsers if missing).
- Two instances of the app are running to simulate two participants:
  - First instance: `npm start` → http://localhost:3000  
  - Second instance: `PORT=3001 npm start` → http://localhost:3001

Note: The tests assume the app is available at these two ports. If you change ports, update any test setup or environment variables accordingly.

---

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start two local app instances (in separate terminals):
```bash
# Terminal A
npm start

# Terminal B
PORT=3001 npm start
```

Now the app should be available at:
- http://localhost:3000
- http://localhost:3001

---

## Running Tests

From the project root you can run Playwright tests for the `src/TestApp` folder.

Run all tests:
```bash
npx playwright test src/TestApp
```

Run a specific test suite:
```bash
npx playwright test src/TestApp/MeetingSetup.spec.js
npx playwright test src/TestApp/MediaSimulation.spec.js
npx playwright test src/TestApp/DeviceControl.spec.js
npx playwright test src/TestApp/PubSubChat.spec.js
```

Run tests with a visible browser (helpful for debugging):
```bash
npx playwright test src/TestApp --headed
```

Using fake media devices (ensures consistent CI test runs). You can add these chromium flags in Playwright launch options or pass via environment depending on your config:
- `--use-fake-device-for-media-stream`
- `--use-fake-ui-for-media-stream`

For example, when launching Chromium manually you might use:
```bash
# Example: environment variable or Playwright config adjustments required
# This is illustrative; configure Playwright launchOptions in your test config.
```

If your CI needs to run headless with fake devices, ensure the Playwright/browser launch config includes the flags above.

---

## Test Coverage

The tests cover the following behaviors and scenarios.

1. Meeting Setup (MeetingSetup.spec.js)
- ✅ Create and join a meeting successfully
- ✅ Join an existing meeting using a meeting ID
- ✅ Two participants join the same meeting

2. Media Simulation (MediaSimulation.spec.js)
- ✅ Inject fake video/audio streams using --use-fake-device-for-media-stream
- ✅ Verify video/audio upload (User A)
- ✅ Verify video/audio download (User B sees User A's media)
- ✅ Check video element readyState and dimensions
- ✅ Check audio track activity

3. Device Control (DeviceControl.spec.js)
- ✅ Disable camera - video disappears for remote participant
- ✅ Enable camera - video reappears for remote participant
- ✅ Disable microphone - audio track becomes inactive
- ✅ Enable microphone - audio track becomes active

4. PubSub Chat (PubSubChat.spec.js)
- ⏸️ Send & receive chat messages (skipped - requires chat UI)
- ⏸️ Multiple message history (skipped - requires chat UI)

Notes:
- Skipped chat tests are placeholders that require an available chat UI component to be enabled in the app under test.
- Tests use explicit waits and Playwright expect assertions to reduce flakiness.

---

## Test Structure & Approach

- Simulate multiple participants using two browser contexts (or two browser instances) against two app instances (ports 3000 and 3001).
- Use fake media devices for deterministic audio/video streams in CI: `--use-fake-device-for-media-stream` and `--use-fake-ui-for-media-stream`.
- Verify media by inspecting HTMLMediaElement properties (e.g., `readyState`, `videoWidth`/`videoHeight`) and MediaStreamTrack states.
- Ensure timeouts and async operations are handled with Playwright's robust waiting/assertion primitives to minimize flakiness.
- Tests are located under `src/TestApp` and are organized by feature (MeetingSetup, MediaSimulation, DeviceControl, PubSubChat).

---

## React App Scripts

This project was bootstrapped with Create React App. The following npm scripts are available:

- `npm start`  
  Runs the app in development mode. Open http://localhost:3000.

- `npm test`  
  Launches the interactive test runner.

- `npm run build`  
  Builds the app for production to the `build` folder.

- `npm run eject`  
  Removes the single build dependency from your project — use with caution. This is a one-way operation.

---

## Troubleshooting

- Port already in use: ensure nothing else is running on ports 3000 or 3001, or change the second instance port and update test configuration.
- Browser permissions: local browsers may block getUserMedia prompts. Using `--use-fake-ui-for-media-stream` bypasses permission prompts in automated runs.
- Playwright browser binaries: If Playwright prompts to install browser binaries, accept or run `npx playwright install`.
- CI: Ensure the CI runner supports launching browsers and that required flags for fake devices are set in Playwright's launchOptions.

---

## Learn More

- React: https://reactjs.org/
- Create React App: https://create-react-app.dev/
- Playwright: https://playwright.dev/

---

## Contributing

Contributions, improvements to tests, or extensions are welcome. Please open issues or pull requests in the repository including:
- A clear description of the change
- Reproduction steps (if applicable)
- Any CI adjustments required for new tests

---

## License

This project is provided under the repository's license. Check the LICENSE file for details.
