# Sonder Mobile

Expo React Native app for Sonder.

## Local

```sh
cp .env.example .env
corepack pnpm install
corepack pnpm dev:mobile
```

Set `EXPO_PUBLIC_API_BASE_URL` to the local or deployed API base URL. Physical devices usually need a LAN URL instead of `localhost`.

Real APNs/FCM native push token testing requires an EAS dev-client or standalone build. Expo Go is not enough for the native device token flow used by this app.

## Install On A Phone

Development build, installed like a real app but connected to your local Metro server:

```sh
corepack pnpm --filter @sonder/mobile eas:login
corepack pnpm --filter @sonder/mobile eas:init
corepack pnpm --filter @sonder/mobile build:android:dev
corepack pnpm --filter @sonder/mobile dev:client
```

For iOS, use `build:ios:dev`. iOS physical device installs require an Apple Developer account and device provisioning.

Preview build, standalone and not dependent on Metro:

```sh
corepack pnpm --filter @sonder/mobile build:android:preview
```

Preview builds need `EXPO_PUBLIC_API_BASE_URL` configured for an API the phone can reach, usually a deployed API URL.
