# Sonder API

Next.js App Router API for Sonder.

## Local

```sh
cp .env.example .env
corepack pnpm install
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm --filter @sonder/api db:seed
corepack pnpm dev:api
```

The API uses anonymous JWT sessions and database-backed invite codes. Business logic lives in `src/services`, data access lives in `src/repositories`, and route handlers stay thin for a future Lambda-to-ECS migration.

## Flags

- `INVITE_ONLY_MODE`
- `POSTING_ENABLED`
- `PUSH_NOTIFICATIONS_ENABLED`
- `MAINTENANCE_MODE`
- `ADMIN_DASHBOARD_ENABLED`

Admin routes require `x-admin-secret` and `ADMIN_DASHBOARD_ENABLED=true`.

