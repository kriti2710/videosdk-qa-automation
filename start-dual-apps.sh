#!/bin/bash

# Script to start two instances of the VideoSDK app for testing

echo "Starting VideoSDK app on two ports for Playwright testing..."

# Start first instance on port 3000
echo "Starting app on localhost:3000..."
npm start &
APP1_PID=$!

# Wait a moment for the first app to start
sleep 5

# Start second instance on port 3001
echo "Starting app on localhost:3001..."
PORT=3001 npm start &
APP2_PID=$!

echo "Both apps are starting..."
echo "App 1 (localhost:3000) PID: $APP1_PID"
echo "App 2 (localhost:3001) PID: $APP2_PID"
echo ""
echo "To stop both apps, run: kill $APP1_PID $APP2_PID"
echo "Or press Ctrl+C to stop this script"

# Wait for both apps to be ready
echo "Waiting for apps to be ready..."
sleep 10

# Check if both apps are running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ App 1 is ready on localhost:3000"
else
    echo "❌ App 1 failed to start on localhost:3000"
fi

if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ App 2 is ready on localhost:3001"
else
    echo "❌ App 2 failed to start on localhost:3001"
fi

echo ""
echo "You can now run Playwright tests:"
echo "npx playwright test src/TestApp"

# Keep script running
wait
