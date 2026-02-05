# Copilot Instructions (Project-Specific)

This repository is a NestJS + Prisma backend. Use these notes to produce correct, consistent changes.

## 1) System overview
- Entry point: `src/main.ts` (global prefix `/api`, versioned `/v1`, Swagger in non-production).
- Root module: `src/app/app.module.ts` (global guards, interceptors, filters, middleware).
- Database: Prisma schema in `src/database/schema.prisma` with migrations in `src/database/migrations/`.
- I18n: `src/i18n/en/*.json` and message keys in `src/**/messages/*`.
- Response format: centralized in `src/core/class/response.class.ts` via `ResponseResult`.

## 2) Request/response flow (high-level)
1. **Middleware**: `TraceMiddleware` adds request context.
2. **Guards**: `AuthGuard` + `CustomThrottlerGuard` handle auth and rate limiting.
3. **Interceptors**: `ResponseInterceptor` standardizes API responses.
4. **Filters**: `HttpExceptionsFilter` handles errors.
5. **Controllers → Services → Repositories → Prisma**.

## 3) Feature modules and responsibilities
Current modules are wired in `src/app/app.module.ts`:
- **Auth**: login, token flow, auth helpers.
- **User**: user CRUD and profile behavior.
- **Role / User-Role**: role definition and assignments.
- **MFA**: multi-factor methods and verification flows.
- **Clinic / Supplier / Enquiry**: domain-specific features.
- **Notification**: notifications and delivery.
- **Jobs**: scheduled tasks (cron).
- **Audit**: auditing and change tracking.

When adding a new feature, follow the existing module structure:
- `dtos/`, `interfaces/`, `messages/`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.module.ts`.

## 4) Conventions to follow
- DTO validation and transformation are enforced globally (whitelist, transform, no extra fields).
- Use message keys from `src/**/messages/*` and `src/i18n/en/*.json` for user-facing text.
- Use `ResponseResult` for success responses.
- Prefer existing utilities in `src/common/utils/` (e.g., hashing, error handling).
- Use enums in `schema.prisma` (e.g., `UserStatusEnum`, `AccountTypeEnum`).
- Respect existing `SWAGGER_TAGS` in `src/common/constants/common.constant.ts`.

## 5) Common file locations
- App bootstrap: `src/main.ts`
- App module: `src/app/app.module.ts`
- Auth guard/decorators: `src/core/guards`, `src/core/decorators`
- Shared services: `src/common/services`
- Prisma service: `src/database/prisma.service.ts`
- Prisma schema: `src/database/schema.prisma`

## 6) How Copilot should make changes
- Prefer small, focused edits that align with current patterns.
- Update or add unit tests in the same module when changing behavior.
- Keep naming consistent with existing DTOs and message keys.
- Avoid introducing new libraries unless necessary.
- Preserve linting and formatting rules (ESLint/Prettier).

## 7) Quick sanity checks before finishing
- Ensure new controllers are registered in the module file.
- Ensure new providers are included in module `providers`/`exports` if needed.
- Ensure new Prisma fields are reflected in DTOs and repositories.
- Ensure new message keys exist in i18n files if referenced.

## 8) Helpful endpoints
- API base: `/api/v1`
- Health: `/api/v1/health-check`
- Swagger: `/docs` (non-production)

---

If you are uncertain about a change, inspect the closest existing module and mirror its pattern to stay consistent with this codebase.
