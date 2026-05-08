# Sonder

Sonder is a hyper-local temporary notes app. Users can leave short text notes, optionally with a YouTube, Spotify, or generic HTTP/HTTPS link, and the note is visible only to users physically nearby. The first beta uses a fixed 100 meter visibility radius and a fixed 24 hour TTL enforced by the backend.

This repository is built as a launchable MVP, not a showcase demo. It favors safety, privacy by design, moderation, abuse prevention, low fixed cost, and a clean migration path.

## Architecture

Initial beta:

```txt
Mobile app -> API Gateway HTTP API -> AWS Lambda API -> PostgreSQL
                                                 -> AWS End User Messaging Push -> APNs / FCM
```

Future path:

```txt
Phase 1: Mobile -> API Gateway HTTP API -> Lambda API -> PostgreSQL
Phase 2: Mobile -> API Gateway HTTP API -> Lambda API -> RDS PostgreSQL + RDS Proxy
Phase 3: Mobile -> Application Load Balancer -> ECS Fargate API -> RDS PostgreSQL
```

The initial Terraform intentionally does not create ECS, EKS, EC2, ALB, NAT Gateway, or always-on tasks.

## Monorepo

```txt
sonder/
  apps/
    mobile/      Expo React Native app
    api/         Next.js API route handlers and service layer
  packages/
    shared/      App config, DTOs, schemas, link and distance utilities
  infra/
    terraform/   Serverless AWS infrastructure
```

## Requirements

- Node.js 20
- Corepack
- Docker for local Postgres
- pnpm via Corepack

```sh
corepack enable
pnpm install
```

## Local Setup

All commands below should be run from the repository root:

```sh
cd D:\mobil\sonder
```

Start Postgres:

```sh
docker compose up -d postgres
```

Create local env files:

```sh
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Generate Prisma and run migrations:

```sh
pnpm db:generate
pnpm db:migrate
pnpm --filter @sonder/api db:seed
```

The seed creates a local invite code, defaulting to `SONDER-BETA`.

Run the API:

```sh
pnpm dev:api
```

Run the mobile app:

```sh
pnpm dev:mobile
```

For a physical device, set `EXPO_PUBLIC_API_BASE_URL` to your machine LAN address, for example `http://192.168.1.50:3000`.

## App Config

Shared constants live in [appConfig.ts](./packages/shared/src/config/appConfig.ts).

The backend enforces:

- 24 hour note TTL
- 100 meter visibility radius
- 100 meter presence radius
- 120 character max note length
- note/report/push rate limits
- report auto-hide threshold

The mobile app does not expose radius or TTL selectors.

## Privacy Model

- The mobile app never shows a map.
- The API never returns exact note coordinates.
- Stored coordinates are rounded according to `APP_CONFIG.LOCATION_DECIMAL_PRECISION`.
- Presence returns only `isOwnerNearby`.
- Presence never returns owner location or last seen time.
- Anonymous notes are anonymous to other users, not to the platform.
- Users who report a note stop seeing it immediately.

## Safety And Moderation

Launch controls included from day one:

- Invite-only beta mode
- Age confirmation
- Terms and Privacy acceptance
- Report button on every note
- Local hide after report
- Report threshold auto-hide
- Admin note list/report list/hide/delete endpoints
- Admin user ban endpoint
- Note/report/push rate limits
- Posting, push, maintenance, invite-only, and admin feature flags

Admin endpoints require both `ADMIN_DASHBOARD_ENABLED=true` and the `x-admin-secret` header.

## Backend

The API is built with Next.js App Router route handlers. Route handlers are thin and delegate to:

- `services/`
- `repositories/`
- `lib/`

This keeps business logic portable for a later ECS Fargate move.

Important endpoints:

- `GET /api/v1/health`
- `POST /api/v1/auth/anonymous`
- `POST /api/v1/invite/verify`
- `POST /api/v1/devices/register`
- `POST /api/v1/presence/heartbeat`
- `GET /api/v1/notes/nearby?latitude=...&longitude=...`
- `POST /api/v1/notes`
- `POST /api/v1/notes/:id/report`
- `GET /api/v1/admin/notes`
- `GET /api/v1/admin/reports`
- `POST /api/v1/admin/notes/:id/hide`
- `POST /api/v1/admin/notes/:id/delete`
- `POST /api/v1/admin/users/:id/ban`

## Database

Sonder uses Prisma and PostgreSQL. For the first beta, use a low-cost pooled Postgres provider such as Neon or Supabase. AWS RDS PostgreSQL with RDS Proxy is a later production option when traffic justifies the fixed cost.

The current location query uses a bounding-box prefilter plus Haversine distance in the service layer. That keeps the MVP simple and portable. The location service boundary is intentionally clean so PostGIS `ST_DWithin` and `ST_Distance` can replace it later without changing route handlers or mobile contracts.

## Push Notifications

The mobile app registers native APNs/FCM device tokens with:

```txt
POST /api/v1/devices/register
```

Real native push token behavior requires an EAS dev-client or standalone build. Expo Go is not enough for APNs/FCM native token validation.

Backend push behavior:

- Sends only when `PUSH_NOTIFICATIONS_ENABLED=true`
- Logs payloads locally when disabled
- Excludes the author
- Rate-limits per recipient
- Uses neutral copy:
  - Title: `New note nearby`
  - Body: `Someone left a note around you.`

AWS currently documents End User Messaging Push sends through the Pinpoint `SendMessages` API. The code uses `@aws-sdk/client-pinpoint`, and Terraform uses the provider resources exposed as `aws_pinpoint_*`.

Do not commit APNs or FCM credentials. Configure them with Terraform sensitive variables, AWS Secrets Manager, or manual console setup where required.

## Terraform

Terraform lives in [infra/terraform](./infra/terraform).

Initial resources:

- API Gateway HTTP API
- Lambda API function
- Lambda IAM role
- CloudWatch log group with 7 day default retention
- Secrets Manager secrets
- Pinpoint-compatible push application/channel resources where supported
- Optional API Gateway custom domain

Example:

```sh
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Create the Lambda zip before applying. The GitHub Actions workflow packages the API with OpenNext and updates Lambda.

## CI/CD

[api-deploy.yml](./.github/workflows/api-deploy.yml) uses GitHub OIDC. Configure:

- `secrets.AWS_GITHUB_OIDC_ROLE_ARN`
- `secrets.DATABASE_URL`
- `secrets.JWT_SECRET`
- `secrets.ADMIN_SECRET`
- `vars.AWS_REGION`
- `vars.LAMBDA_FUNCTION_NAME`

The workflow:

1. Installs dependencies
2. Generates Prisma client
3. Runs lint
4. Runs tests
5. Builds shared package
6. Builds API
7. Packages Lambda
8. Optionally runs migrations
9. Updates Lambda code

## Tests

```sh
pnpm test
```

Coverage includes:

- distance calculation
- link detection
- validation schemas
- TTL expiration logic
- presence nearby logic
- invite validation
- rate limit helper logic
- report auto-hide threshold
- notification recipient selection

## Store Review Notes

Before submission:

- Replace placeholder Terms and Privacy URLs in the mobile settings screen.
- Replace placeholder support email.
- Confirm APNs/FCM credentials and native token registration in an EAS dev-client or standalone build.
- Keep invite-only mode enabled for the first beta.
- Keep push disabled until credentials and notification copy are reviewed.
- Verify moderation/admin access is enabled only for trusted operators.

## Future Roadmap

- Real user profiles
- Reactions
- Better moderation tools
- Better admin dashboard
- Stronger distributed rate limiting
- Push notification preferences
- Observability dashboard
- PostGIS or improved geospatial indexing
- More abuse prevention
- Optional campus/venue verification
- RDS PostgreSQL + RDS Proxy if database load grows
- ECS Fargate migration if traffic grows enough to justify ALB/ECS/NAT fixed costs
