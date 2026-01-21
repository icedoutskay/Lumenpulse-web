# Lumenpulse Mobile 🚀

Lumenpulse Mobile is the cross-platform mobile client for the Lumenpulse ecosystem, built with Expo and TypeScript. It provides real-time crypto news aggregation and portfolio tracking on the go.

## Features (In Progress)

- **News Feed**: Aggregated news from top sources with sentiment analysis.
- **Portfolio Tracking**: Real-time asset monitoring and performance metrics.
- **On-chain Rewards**: Earn rewards for community contributions.

## Prerequisites

- **Node.js**: 18.x or later
- **pnpm**: `npm install -g pnpm`
- **Expo Go**: Download on iOS/Android for physical device testing.

## Getting Started

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Setup Environment**:

   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server**:

   ```bash
   pnpm start
   ```

4. **Run on Platforms**:
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Press `w` for Web.
   - Scan the QR code with Expo Go to run on a physical device.

## Scripts

- `pnpm start`: Start Expo dev server.
- `pnpm android`: Open on Android.
- `pnpm ios`: Open on iOS.
- `pnpm web`: Open as a progressive web app.
- `pnpm lint`: Run ESLint.
- `pnpm tsc`: Run TypeScript compiler check.

## Architecture

The app follows a modern Expo Router structure (optional) or `App.tsx` entry point. Styling is handled via standard `StyleSheet` with a custom dark theme design system.
