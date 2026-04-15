#!/bin/bash

# BrainBox Verification Script
# This script runs typecheck, tests, and build to ensure a green state.

# Add node/pnpm to PATH
export PATH="/home/hackamvigo/.nvm/versions/node/v24.14.1/bin:$PATH"

echo "🚀 Starting BrainBox Verification..."

# 1. Typecheck
echo "🔍 Running Typecheck..."
pnpm -r typecheck
if [ $? -ne 0 ]; then
  echo "❌ Typecheck FAILED"
  exit 1
fi
echo "✅ Typecheck PASSED"

# 2. Test
echo "🧪 Running Tests..."
# Note: we use --if-present to skip packages without tests if any
pnpm --recursive --if-present run test -- "all"
if [ $? -ne 0 ]; then
  echo "❌ Tests FAILED"
  exit 1
fi
echo "✅ Tests PASSED"

# 3. Build (web-app)
echo "🏗️ Running Web-App Build..."
pnpm --filter web-app build
if [ $? -ne 0 ]; then
  echo "❌ Build FAILED"
  exit 1
fi
echo "✅ Build PASSED"

echo "🎉 ALL SYSTEMS GREEN!"
exit 0
