## Playwright tests for VideoSDK

### Prerequisites
- Node.js installed
- **Two app instances running:**
  - First instance: `npm start` (on http://localhost:3000)
  - Second instance: `PORT=3001 npm start` (on http://localhost:3001)

### Run tests
```bash
# Run all tests
npx playwright test src/TestApp

# Run specific test suites
npx playwright test src/TestApp/MeetingSetup.spec.js
npx playwright test src/TestApp/MediaSimulation.spec.js
npx playwright test src/TestApp/DeviceControl.spec.js
npx playwright test src/TestApp/PubSubChat.spec.js

# Run with visible browser (for debugging)
npx playwright test src/TestApp --headed
```

### Test Coverage

#### 1. Meeting Setup (`MeetingSetup.spec.js`)
- ✅ Create meeting and join successfully
- ✅ Join existing meeting with meeting ID
- ✅ Two participants join same meeting

#### 2. Media Simulation (`MediaSimulation.spec.js`)
- ✅ Inject fake video/audio streams using `--use-fake-device-for-media-stream`
- ✅ Verify video/audio upload (User A)
- ✅ Verify video/audio download (User B sees User A's media)
- ✅ Check video element readyState and dimensions
- ✅ Check audio track activity

#### 3. Device Control Testing (`DeviceControl.spec.js`)
- ✅ Disable camera - video disappears for remote participant
- ✅ Enable camera - video reappears for remote participant
- ✅ Disable microphone - audio track becomes inactive
- ✅ Enable microphone - audio track becomes active

#### 4. PubSub Chat (`PubSubChat.spec.js`)
- ⏸️ Send & receive chat messages (skipped - requires chat UI implementation)
- ⏸️ Multiple message history (skipped - requires chat UI implementation)

### Test Structure
- Uses two browser contexts to simulate multiple participants
- Fake media devices for reliable CI testing
- Proper Playwright expect() assertions for video/audio elements
- Timeout handling for async operations

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
